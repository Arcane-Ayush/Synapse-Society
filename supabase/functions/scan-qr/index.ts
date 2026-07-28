// Supabase Edge Function: scan-qr
// Deployed via: supabase functions deploy scan-qr
//
// All QR scan validation happens SERVER-SIDE here.
// The client sends { qr_code: string } — we never trust anything else from the client.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Use service_role key to bypass RLS (this runs server-side only)
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            { auth: { persistSession: false } }
        );

        // Authenticate the calling user via their JWT
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(
            authHeader.replace('Bearer ', '')
        );
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const body = await req.json();
        const { qr_code } = body;
        if (!qr_code || typeof qr_code !== 'string') {
            return new Response(JSON.stringify({ error: 'qr_code is required' }), {
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 1. Look up the QR code
        const { data: qr, error: qrError } = await supabase
            .from('qr_codes')
            .select('*')
            .eq('code', qr_code.trim())
            .single();

        if (qrError || !qr) {
            return new Response(JSON.stringify({ error: 'QR code not found' }), {
                status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 2. Verify QR is active
        if (!qr.is_active) {
            await logScan(supabase, user.id, qr.id, false, 'QR code is inactive');
            return new Response(JSON.stringify({ error: 'QR code is no longer active' }), {
                status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 3. Check expiry
        if (qr.expires_at && new Date(qr.expires_at) < new Date()) {
            await logScan(supabase, user.id, qr.id, false, 'QR code has expired');
            return new Response(JSON.stringify({ error: 'QR code has expired' }), {
                status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 4. Prevent duplicate claims (unless reusable)
        if (!qr.is_reusable) {
            const { data: existing } = await supabase
                .from('qr_scan_history')
                .select('id')
                .eq('user_id', user.id)
                .eq('qr_id', qr.id)
                .eq('success', true)
                .maybeSingle();

            if (existing) {
                return new Response(JSON.stringify({ error: 'You have already claimed this QR code' }), {
                    status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // 5. Award XP (using our transactional RPC function)
        let xpResult = null;
        if (qr.reward_xp > 0) {
            const { data } = await supabase.rpc('award_xp', {
                p_user_id:      user.id,
                p_amount:       qr.reward_xp,
                p_reason:       `QR Code scan: ${qr.label ?? qr.code}`,
                p_source:       'qr_scan',
                p_reference_id: qr.id,
            });
            xpResult = data;
        }

        // 6. Award card if applicable
        if (qr.reward_card_id) {
            await supabase.from('user_cards').insert({
                user_id: user.id,
                card_id: qr.reward_card_id,
                source:  'qr_scan',
            }).onConflict('user_id, card_id').ignore();

            // Update total_cards
            await supabase.rpc('award_xp', {
                p_user_id: user.id, p_amount: 0,
                p_reason: 'card_count_sync', p_source: 'system'
            });
        }

        // 7. Log successful scan
        await logScan(supabase, user.id, qr.id, true, null);

        return new Response(JSON.stringify({
            success: true,
            xp_awarded:    qr.reward_xp,
            card_awarded:  qr.reward_card_id,
            leveled_up:    xpResult?.leveled_up ?? false,
            level_new:     xpResult?.level_new,
            card_unlocked: xpResult?.card_unlocked,
        }), {
            status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('scan-qr error:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

async function logScan(supabase, userId, qrId, success, failureReason) {
    await supabase.from('qr_scan_history').insert({
        user_id:        userId,
        qr_id:          qrId,
        success,
        failure_reason: failureReason,
    });
}

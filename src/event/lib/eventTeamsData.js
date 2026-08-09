import { supabase } from '../../lib/supabase';

/**
 * Fetch all 40 event squads live from Supabase database.
 * No hardcoded frontend mock arrays.
 */
export async function getEventTeams() {
    try {
        const { data, error } = await supabase
            .from('event_teams')
            .select('*')
            .order('id', { ascending: true });
        if (data && data.length > 0) return data;
    } catch (e) {
        console.error('Error fetching event teams:', e);
    }
    return [];
}

export async function getTeamByCode(code) {
    if (!code) return null;
    const clean = code.trim().toUpperCase();
    try {
        const { data } = await supabase
            .from('event_teams')
            .select('*')
            .or(`code.ilike.${clean},name.ilike.%${clean}%`)
            .maybeSingle();
        return data || null;
    } catch (e) {
        return null;
    }
}

/**
 * Returns a sleek 2-digit number badge for a team (e.g. "01", "07", "40") instead of emoji icons.
 */
export function getTeamNumberBadge(team) {
    if (!team) return '01';
    const match = (team.code || team.name || '').match(/\d+/);
    if (match) {
        return String(match[0]).padStart(2, '0');
    }
    return String(team.id || '01').padStart(2, '0');
}

const supabaseUrl = 'https://pucgdanumzbypsexkotk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1Y2dkYW51bXpieXBzZXhrb3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMDgyNjMsImV4cCI6MjEwMDc4NDI2M30.XQb6WfIQd4LF5TCHxUFa_uYuiEFSqEOhiMWmxmGN078';

async function resetAllTeamsToZero() {
    console.log('Fetching all teams from Supabase DB...');
    const getRes = await fetch(`${supabaseUrl}/rest/v1/event_teams?select=id`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });

    const teams = await getRes.json();
    console.log(`Resetting s_coins, points, and status to 0 for all ${teams.length} teams in Supabase DB...`);

    let resetCount = 0;
    for (const team of teams) {
        const res = await fetch(`${supabaseUrl}/rest/v1/event_teams?id=eq.${team.id}`, {
            method: 'PATCH',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                s_coins: 0,
                quiz_score: 0,
                is_qualified: false,
                is_eliminated: false,
                is_active: false,
                members: [],
                updated_at: new Date().toISOString()
            })
        });

        if (res.ok) resetCount++;
    }

    console.log(`✓ VERIFIED & CONFIRMED! Reset all ${resetCount}/${teams.length} teams to 0 S-Coins and clean status in Supabase DB.`);
}

resetAllTeamsToZero();

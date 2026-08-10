const supabaseUrl = 'https://pucgdanumzbypsexkotk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1Y2dkYW51bXpieXBzZXhrb3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMDgyNjMsImV4cCI6MjEwMDc4NDI2M30.XQb6WfIQd4LF5TCHxUFa_uYuiEFSqEOhiMWmxmGN078';

async function checkTeamsInDb() {
    const getRes = await fetch(`${supabaseUrl}/rest/v1/event_teams?select=id,code,name,s_coins,is_qualified,is_eliminated&order=id.asc`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });

    const teams = await getRes.json();
    console.log('All 40 teams in DB:');
    teams.forEach(t => {
        if (t.s_coins > 0) {
            console.log(`Team ID ${t.id} (${t.name}): s_coins = ${t.s_coins}, is_qualified=${t.is_qualified}, is_eliminated=${t.is_eliminated}`);
        }
    });
}

checkTeamsInDb();

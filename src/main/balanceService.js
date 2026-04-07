const usageService = require('./usageService');
const settingsManager = require('./settingsManager');
const https = require('https');

function getBalances() {
    const settings = settingsManager.load();
    const deepgramBudget = settings.DEEPGRAM_BUDGET || 10;
    const grokBudget = settings.GROK_BUDGET || 10;

    const grokUsed = usageService.getGrokTotalCost();
    const deepgramUsed = usageService.getDeepgramTotalCost();

    return {
        grok: {
            used: grokUsed,
            remaining: grokBudget - grokUsed,
        },
        deepgram: {
            used: deepgramUsed,
            remaining: deepgramBudget - deepgramUsed,
        }
    };
}

async function fetchGrokStatus(key) {
    if (!key) return false;

    return new Promise((resolve) => {
        const options = {
            hostname: 'api.x.ai',
            path: '/v1/models',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${key}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(true); 
                } else {
                    resolve(false);
                }
            });
        });

        req.on('error', () => resolve(false));
        req.end();
    });
}

module.exports = {
    getBalances,
    fetchGrokStatus
};

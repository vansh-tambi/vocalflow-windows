const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function getUsagePath() {
    return path.join(app.getPath("userData"), "usage.json");
}

function readData() {
    const filePath = getUsagePath();
    if (!fs.existsSync(filePath)) {
        return { grok: [], deepgram: [] };
    }
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);
        if (!parsed.grok) parsed.grok = [];
        return parsed;
    } catch (e) {
        return { grok: [], deepgram: [] };
    }
}

function writeData(data) {
    const filePath = getUsagePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// GROK
function logGrokUsage(tokens, cost) {
    const data = readData();
    data.grok.push({ tokens, cost, timestamp: Date.now() });
    writeData(data);
}

function getGrokTotalCost() {
    const data = readData();
    return data.grok.reduce((sum, x) => sum + x.cost, 0);
}

// DEEPGRAM
function logDeepgramUsage(minutes, cost) {
    const data = readData();
    data.deepgram.push({ minutes, cost, timestamp: Date.now() });
    writeData(data);
}

function getDeepgramTotalCost() {
    const data = readData();
    return data.deepgram.reduce((sum, x) => sum + x.cost, 0);
}

module.exports = {
    logGrokUsage,
    getGrokTotalCost,
    logDeepgramUsage,
    getDeepgramTotalCost
};

function parseManaCost(costString) {
    //convert "{2}{U}{U}" to ["2", "U", "U"]
    const regex = /{([^}]+)}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(costString))) {
        matches.push(match[1]);
    }
    return matches;
}

function canCast(manaCostString, manaPool) {
    const required = parseManaCost(manaCostString);
    const pool = [...manaPool];

    for (let symbol of required) {
        const idx = pool.findItem(m => m === symbol) || (symbol.match(/^\d+$/) && !isNaN(parseInt(m)));
        if (idx !== -1) {
            pool.splice(idx, 1) //use one mana
        } else if (symbol.match(/^\d+$/)) {
            //handle generic cost like "2" using any available mana
            let generic = parseInt(symbol);
            if (pool.length >= generic) {
                pool.splice(0, generic);
            } else {
                return false
            }
        } else {
            return false
        }
    }
    return true
}

module.exports = { canCast };
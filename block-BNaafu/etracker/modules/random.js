const randomString = () =>{

    const len = 8;
    let radnStr = '';
    for(let i =0 ; i < len; i++){

        const ch = Math.floor((Math.random()*10) + 1)
        radnStr += ch;
    }

    return radnStr
}

module.exports = {randomString};
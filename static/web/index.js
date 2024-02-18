var scores = {
    'p1': 0,
    'p2': 0,
    'p3': 0,
    'p4': 0,
}

var names = {
    'p1': 0,
    'p2': 0,
    'p3': 0,
    'p4': 0,
}

const up_int = num => {
    const tens = Math.floor((num % 100) / 10); // 获取十位数字
    const hundreds = Math.floor(num / 100); // 获取百位数字
    if (tens !== 0) { // 如果十位数字不为0
        return (hundreds + 1) * 100;
    } else {
        return num;
    }
}

list_score = () => {
    let txt = ''
    for (let i = 1; i <= 4; ++i) {
        _i = `p${i}`
        txt += `${names[_i]}: ${scores[_i]}<br>`
    }
    $('#score').html(txt)
}

calc_score = (fan, fu) => {
    let b = 0
    if (fan >= 13) {
        b = 8000
    } else if (fan == 11 && fan == 12) {
        b = 6000
    }
    else if (fan >= 8 && fan <= 10) {
        b = 4000
    }
    else if (fan >= 6 && fan <= 7) {
        b = 3000
    }
    else if (fan == 5) {
        b = 2000
    } else {
        b = fu * (1 << (fan + 2))
        if (b > 2000) b = 2000
    }
    return b
}

round_over = () => {
    let info = ''
    let a = calc_score(+$('#vfan').val(), +$('#vfu').val())
    let winner = $('input[name="win"]:checked').val()
    let zhuang = $('input[name="zhuang"]:checked').val()
    let way = $('input[name="winway"]:checked').val()
    let loser = $('input[name="lose"]:checked').val()
    let lian = +$('#vlian').val()
    let vli = +$('#vli').val()
    let slian = lian * 100

    if (way == 'dp' && winner == loser) {
        info = '不能点自己的炮！<br>'
        return info
    }

    if (way == 'dp') {
        info = `${names[loser]}给${names[winner]}点炮！<br>`
    } else {
        info = `${names[winner]}自摸！<br>`
    }

    if (winner == zhuang) {
        if (way == 'dp') {
            let _s = up_int(6 * a) + slian * 3
            scores[winner] += _s
            scores[loser] -= _s
            info += `支付了庄家${_s}点。<br>`
            if (scores[loser] < 0) {
                info += `${names[loser]}被飞了！<br>`
            }
        } else {
            let _s = up_int(2 * a) + slian
            scores[winner] += 3 * _s
            for (const p in scores) {
                if (p != winner) {
                    scores[p] -= _s
                    info += `${names[p]}支付了庄家${_s}点。<br>`
                    if (scores[p] < 0) {
                        info += `${names[p]}被飞了！<br>`
                    }
                }
            }
        }
    } else {
        if (way == 'dp') {
            _s = up_int(4 * a) + slian * 3
            scores[winner] += _s
            scores[loser] -= _s
            info += `支付了${_s}点。<br>`
            if (scores[loser] < 0) {
                info += `${names[loser]}被飞了！<br>`
            }
        } else {
            let _add = 0
            for (const p in scores)
                if (p != winner) {
                    if (p == zhuang) {
                        _s = up_int(2 * a) + slian
                        _add += _s
                        scores[p] -= _s
                        info += `${names[p]}被炸庄！支付了${_s}点。<br>`
                        if (scores[p] < 0) {
                            info += `${names[p]}被飞了！<br>`
                        }
                    } else {
                        _s = up_int(a) + slian
                        _add += _s
                        scores[p] -= _s
                        info += `${names[p]}支付了${_s}点。<br>`
                        if (scores[p] < 0) {
                            info += `${names[p]}被飞了！<br>`
                        }
                    }
                }
            scores[winner] += _add
        }
    }
    if (vli > 0){
        scores[winner] += vli * 1000
        info += `${names[winner]}收获立直棒${vli}! <br>`
    }
    list_score()
    return info
}

$('#btn-init').click(() => {
    for (let i = 1; i <= 4; ++i) {
        names[`p${i}`] = $(`#p${i}`).val()
        $(`#d${i}`).text(names[`p${i}`])
        $(`#e${i}`).text(names[`p${i}`])
    }
    for (const key in scores) {
        scores[key] = +$('#iscore').val()
    }
    list_score()
    $('#info').html('新的一局开始了！<br>')
})

$('#winlose').click(() => {
    _info = round_over()
    add_info(_info)
})

$('#btn-zero').click(() => {
    $('#vfan').val(1)
    $('#vfu').val(30)
    $('#vlian').val(0)
    $('#vli').val(0)
})

const add_info = txt=>{
    _ori = $('#info').html()
    $('#info').html(_ori + txt)
    $('#info').scrollTop(999999)
}

$('.btn-li').click(function () {
    let p = `p${this.id[1]}`
    if (scores[p] >= 1000){
        scores[p] -= 1000
        let _v = +$('#vli').val()
        $('#vli').val(_v + 1)
        add_info(`${names[p]}立直！<br>`)
    } else{
        add_info(`点不够，没法立直！<br>`)
    }
    list_score()
})

export const state = () => ({
  //自国通貨,総資金,SLPIP,RISK%,通貨ペアレート,通貨量/1lot
  cur_type: String(localStorage.getItem('cur_type')) || '',
  amount:   Number(localStorage.getItem('amount'))   || 10000,
  sl_pip:   Number(localStorage.getItem('sl_pip'))   || 20,
  risk:     Number(localStorage.getItem('risk'))     || 1.0,
  pair:     String(localStorage.getItem('pair'))     || 'EUR/USD',
  lot_rate: Number(localStorage.getItem('lot_rate')) || 1000,
})

export const mutations = {
  set_cur_type(state,x){
    state.cur_type = String(x)
    localStorage.setItem('cur_type',state.cur_type)
  },
  set_amount(state,x){
    state.amount = Number(x)
    localStorage.setItem('amount',state.amount)
    console.log(state.amount)
  },
  set_sl_pip(state,x){
    state.sl_pip = Number(x)
    localStorage.setItem('sl_pip',state.sl_pip)
  },
  set_risk(state,x){
    state.risk = Number(x)
    localStorage.setItem('risk',state.risk)
  },
  set_pair(state,x){
    state.pair = String(x)
    localStorage.setItem('pair',state.pair)
  },
  set_lot_rate(state,x){
    state.lot_rate = Number(x)
    localStorage.setItem('lot',state.lot_rate)
  }
}
<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row justify="center" align="center">
        <v-col sm="6" md="5">
        <v-row justify="center" align="center">
          <v-col cols="4">
            <v-combobox
              label="資産の通貨"
              :value="$store.state.cur_type"
              @input="set_cur_type"
              :items="['JPY','USD']"
            />
          </v-col>
          <v-col cols="4">
            <v-combobox
              label="通貨ペア"
              :value="$store.state.pair"
              @input="set_pair"
              :items="Object.keys(pair)"
            />
          </v-col>
          <v-col cols="4">
            <v-combobox
              label="1lot=通貨量"
              :value="$store.state.lot_rate"
              @input="set_lot_rate"
              type="Number"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="総資金"
              :value="$store.state.amount"
              @input="set_amount"
              type="Number"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="SLpip"
              :value="$store.state.sl_pip"
              @input="set_sl_pip"
              type="Number"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Risk"
              :value="$store.state.risk"
              @input="set_risk"
              type="Number"
              prefix="%"
            ></v-text-field>
          </v-col>
        </v-row>
        </v-col>
        </v-row>

        <v-row justify="center" align="center">
          <v-col cols="12">
            <v-card
              class="mx-auto"
              max-width="550"
            >
              <v-card-title class="font-weight-regular" v-text="'RESULT'" />
              <v-divider></v-divider>
              <v-card-text>
                <v-row justify="center">
                <v-col cols="8">
                <v-row justify="end" align="center">
                  <v-col cols="6">
                    <v-card flat>
                      <v-card-subtitle v-text="'risk'" class="pb-0"/>
                      <v-card-text v-if="$store.state.cur_type == 'USD'" v-text="'$'+(Math.round(calc_risk /100)*100)/100" />
                      <v-card-text v-else v-text="Math.round(calc_risk)+'円'" />
                    </v-card> 
                  </v-col>
                  <v-col cols="6">
                    <v-card flat>
                      <v-card-subtitle v-text="'Lots'" class="pb-0"/>
                      <v-card-text v-text="Math.round(calc_lot * 100)/100" />
                    </v-card> 
                  </v-col>
                  <v-col cols="6">
                    <v-card flat>
                      <v-card-subtitle v-text="'レバレッジ'" class="pb-0"/>
                      <v-card-text v-text="calc_leverage + '倍'" />
                    </v-card> 
                  </v-col>
                </v-row>
                </v-col>
                </v-row>
              </v-card-text>

            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    const EUR = await fetch("https://api.exchangeratesapi.io/latest", {mode:"cors"}).then(r=>r.json())
    const pair = ['EUR/USD','GBP/USD','AUD/USD','USD/JPY','EUR/JPY','GBP/JPY']
    const data = {}
    pair.forEach(async x=>{
      const value = await fetch(`https://api.exchangeratesapi.io/latest?base=${x.split('/')[0]}&symbols=${x.split('/')[1]}`, {mode:"cors"}).then(r=>r.json())
      data[x] = value.rates[x.split('/')[1]]
    })
    return {
      EUR: EUR.rates,
      cur_type:Object.keys(EUR.rates),
      pair:data,
    }
  },
  methods:{
    set_amount(e){this.$store.commit('set_amount',e)},
    set_sl_pip(e){this.$store.commit('set_sl_pip',e)},
    set_risk(e){this.$store.commit('set_risk',e)},
    set_cur_type(e){this.$store.commit('set_cur_type',e)},
    set_pair(e){this.$store.commit('set_pair',e)},
    set_lot_rate(e){this.$store.commit('set_lot_rate',e)},

    calc_cur_rate(){//例：EUR/USD :JPY ((EUR/USD_Rate * USD/JPY_Rate))
      if(this.$store.state.pair.match(this.$store.state.cur_type)){
        const result = this.pair[this.$store.state.pair]
        return Number(result)
      }else{
        const result = this.pair[this.$store.state.pair] * this.pair[this.$store.state.pair.split('/')[1]+'/'+this.$store.state.cur_type]
        return Number(result)
      }
    }
  },
  computed:{
    calc_lot(){
      return this.$store.state.amount * (this.$store.state.risk / 100) / (this.$store.state.sl_pip * 10) /(this.$store.state.lot_rate /1000)
    },
    calc_risk(){
      return this.$store.state.amount * (this.$store.state.risk / 100)
    },
    calc_leverage(){
      const amount = this.$store.state.amount / (this.$store.state.sl_pip * 0.01) * (this.$store.state.risk / 100)
      console.log(this.calc_cur_rate())
      return Math.floor(amount / (this.$store.state.amount /this.calc_cur_rate()))//通貨ペアのレートを適用する
    }
  },
  async mounted(){
    console.log(this.pair)
  }
}
</script>
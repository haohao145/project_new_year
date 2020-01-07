//接口
import {
    userApi
} from "@/api/apiList";

export default {
    //这里的state必须是JSON，是一个对象。
    state: {
        count: '', //这里就是所有人员,
        noPrizeData: [], //所有没有中过奖的人
        prizeData: {
            one: {},
            two: {},
            san: {}
        } //中奖的数据存在这里
    },
    //突变，罗列所有可能改变state的方法
    mutations: {
        //没有所谓的大写字母的Type了，就是一个一个函数
        checkUser(state, data) {
            state.count = data;
            state.noPrizeData = data;
        },
    },
    actions: {
        checkUser(context, payload) {
            userApi.axiosuser().then(res => {
                // console.log(res.data)
                // console.log(res)
                if (res.code == 200) {
                    let data = res.data;
                    context.commit('checkUser', data);
                    // this.$message.success("信息提交成功");
                } else {
                    // this.$message.error("信息提交失败");
                }
            })
        }


    },
    getters: {}
}

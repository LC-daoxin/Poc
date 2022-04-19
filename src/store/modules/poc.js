export default {
  namespaced: true,
  state: {
    activitiesSelect: [],
    subActivitiesAll: [],
    templateSelect: []
  },
  mutations: {
    setActivitiesSelect (state, select) { //  保存Activities选择
      state.activitiesSelect = select
    },
    setSubActivitiesAll (state, select) { //  保存SubActivities选择
      state.subActivitiesAll = select
    },
    setTemplateSelect (state, select) {
      state.templateSelect = select
    },
  },
  actions: {
    setActivitiesSelect (context, ref) {
      context.commit('setActivitiesSelect', ref)
    },
    setSubActivitiesAll (context, ref) {
      context.commit('setSubActivitiesAll', ref)
    },
    setTemplateSelect (context, ref) {
      context.commit('setTemplateSelect', ref)
    },
  }
}

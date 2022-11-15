import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userProfile: {},
    opticAdded : false,
    optics : [],
    petitionAdded : true,
    petitions : [],
    planAdded : false,
    observationPlan : null,
    observationPlanDoc : null,
    observationPlans: []
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setOpticAdded(state, val) {
      state.opticAdded = val;
    },
    setOptics(state, val) {
      state.optics = val;
    },
    setPetitionAdded(state, val) {
      state.petitionAdded = val;
    },
    setPetitions(state, val) {
      state.petitions = val;
    },
    setPlanAdded(state, val) {
      state.planAdded = val;
    },
    setObservationPlans(state, val) {
      state.observationPlans = val;
    },
    setObservationPlan(state, val) {
      state.observationPlan = val;
    },
  },
  actions: {

    // ===============
    // ||   USERS   ||
    // ===============

    async login({ dispatch }, form) {
      // sign user in
      const { user } = await fb.authLib.signInWithEmailAndPassword(fb.auth, form.email, form.password)

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },

    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.authLib.createUserWithEmailAndPassword(fb.auth, form.email, form.password);

      const doc = fb.firestoreLib.doc(fb.db, "users", user.uid);
      await fb.firestoreLib.setDoc(doc, {
        username: "Ismael Álvarez",
        role : "sctmaster"
      });
      dispatch('fetchUserProfile', user)
    },
    async logout({ commit }) {
      // log user out
        
      localStorage.removeItem("user")
      if (fb.auth.currentUser)
        await fb.authLib.signOut(fb.auth)

      // clear user data from state
      commit('setUserProfile', {})

      // redirect to login view
      router.push('/login')
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const docRef = fb.firestoreLib.doc(fb.db, "users", user.uid);
      const docSnap = await fb.firestoreLib.getDoc(docRef);

      if (docSnap.exists()) {
        // set user profile in state
        commit('setUserProfile', docSnap.data())
        localStorage.setItem("user", JSON.stringify(docSnap.data()));
        router.push('/')
      } else {
        router.push("/login")
      }
    },

    // ================
    // ||   OPTICS   ||
    // ================
    async addOptics({ commit }, optic) {
      // fetch user profile
      const docRef = await fb.firestoreLib.addDoc(fb.opticsCollection, optic);
      if (docRef.id) {
        commit('setOpticAdded', true)
      }
    },
    async getOptics({ commit }) {
      // fetch user profile
      const querySnapshot  = await fb.firestoreLib.getDocs(fb.opticsCollection);
      var optics = [];

      querySnapshot.forEach(doc => {
        var optic = doc.data();
        optic.id = doc.id;
        optics.push(optic);
      });

      commit('setOptics', optics)
    },

    // ==================
    // ||   PETITION   ||
    // ==================
    async addObservingPetition({ commit }, {petition}) {
      // fetch user profile
      const petitionRef  = await fb.firestoreLib.addDoc(fb.observingPetitionsCollection, petition);

      if (petitionRef.id) {
        commit('setPetitionAdded', true)
      }
    },

    async updateObservingPetition({ commit }, {petition, id}) {
      // fetch user profile
      console.log(petition)

      const petitionRef = fb.firestoreLib.doc(fb.db, "observing_petitions", id);

      await fb.firestoreLib.updateDoc(petitionRef, petition);
      
      commit('setPetitionAdded', true)
    },

    async getPetitions({ commit }, {status}) {
      // fetch user profile
      var operator = "=="
      if (status == "*")
        operator = "!="
      
      const q = fb.firestoreLib.query(fb.firestoreLib.collection(fb.db, "observing_petitions"), fb.firestoreLib.where("status", operator, status));
      const querySnapshot = await fb.firestoreLib.getDocs(q);
      var petitions = [];

      querySnapshot.forEach(doc => {
        var petition = doc.data();
        petition.id = doc.id;
        petitions.push(petition);
      });

      commit('setPetitions', petitions)
    },

    // ==================
    // ||   PLANNING   ||
    // ==================

    async getObservingPlans({ commit }) {
      // fetch user profile
      const q = fb.firestoreLib.query(fb.firestoreLib.collection(fb.db, "observationBlocks"));
      const querySnapshot = await fb.firestoreLib.getDocs(q);
      var plans = []
      querySnapshot.forEach((doc) => {
        var plan = doc.data();
        plan.id = doc.id;
        plans.push(plan);
      });
      commit('setObservationPlans', plans)

    },

    async getObservingPlan({ commit }, date) {
      // fetch user profile
      const q = fb.firestoreLib.query(fb.firestoreLib.collection(fb.db, "observationBlocks"), fb.firestoreLib.where("date", "==", date), fb.firestoreLib.limit(1));
      const querySnapshot = await fb.firestoreLib.getDocs(q);
      var plan = null
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        plan = doc.data();
        plan.id = doc.id;
        this.observationPlanDoc = doc
        //for (var i = 0; i < plan.blocks.length;i++) {
          //plan.blocks[i].petition.optics = {}
        //}
        commit('setObservationPlan', plan)
      });

    },

    async saveObservingPlan({ commit }, plan) {
      // fetch user profile
      //petition.status = "Created"
      //TODO Change petition status to assigned. It cannot be updated after that


      if (this.state.observationPlan) {
        await fb.firestoreLib.updateDoc(this.observationPlanDoc.ref, plan);
        for (const block of plan.blocks) {
          this.dispatch('updateObservingPetition', {petition : block.petition, id: block.petition.id}).finally()
        }
        
        commit('setPlanAdded', true)
      } else {
        const planRef  = await fb.firestoreLib.addDoc(fb.observingPlanCollection, plan);
    
        if (planRef.id) {
          commit('setPlanAdded', true)
          for (const block of plan.blocks) {
            console.log(block.petition)
            this.dispatch('updateObservingPetition', {petition : block.petition, id: block.petition.id})
          }

        } else {
          commit('setPlanAdded', false)
        }
      }
    },
    
  },
  modules: {
  }
})

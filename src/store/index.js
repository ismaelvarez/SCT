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
    petitions : []
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
    }
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
        console.log(docSnap.data())
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
    async addObservingPetition({ commit }, {petition, optics}) {
      // fetch user profile
      petition.status = "Created"
      const petitionRef  = await fb.firestoreLib.addDoc(fb.observingPetitionsCollection, petition);
      
      const col = fb.firestoreLib.collection(fb.db, "observing_petitions", petitionRef.id, "optics")

      const opticsRef  = await fb.firestoreLib.addDoc(col, {
        optics: optics
      });

      if (opticsRef.id) {
        commit('setPetitionAdded', true)
      }
    },

    async getPetitions({ commit }) {
      // fetch user profile
      const querySnapshot  = await fb.firestoreLib.getDocs(fb.observingPetitionsCollection);
      var petitions = [];

      querySnapshot.forEach(doc => {
        var petition = doc.data();
        petition.id = doc.id;
        petitions.push(petition);
      });
      console.log(JSON.stringify(petitions));
      commit('setPetitions', petitions)
    },
    
  },
  modules: {
  }
})

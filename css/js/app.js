 <div id="root"></div>

  <!-- React and ReactDOM from CDN -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

  <!-- Firebase SDK from CDN for browser compatibility -->
  <script src="https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/11.6.1/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore-compat.js"></script>

  <script type="text/javascript">
    const { useState, useEffect, useRef } = React;

    // Global variables for Firebase configuration, provided by the environment
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    // Main App component to serve as the root of the application
    const App = () => {
      const [currentPage, setCurrentPage] = useState('home');
      const [subscriptionTier, setSubscriptionTier] = useState('free');
      const [credits, setCredits] = useState(500);
      const [auditResults, setAuditResults] = useState(null);
      const [user, setUser] = useState(null);
      const [userId, setUserId] = useState(null);
      const [showModal, setShowModal] = useState(false);
      const [db, setDb] = useState(null);
      const [auth, setAuth] = useState(null);
      const [showAuth, setShowAuth] = useState(false);
      const [isLogin, setIsLogin] = useState(true);
      const [isAdmin, setIsAdmin] = useState(false);
    
      useEffect(() => {
        try {
          const firebaseApp = firebase.initializeApp(firebaseConfig);
          const authInstance = firebase.auth();
          const dbInstance = firebase.firestore();
          setAuth(authInstance);
          setDb(dbInstance);
    
          const unsubscribe = authInstance.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
              setUser(currentUser);
              setUserId(currentUser.uid);
              // Check if user is admin
              if (currentUser.uid === 'ADMIN_USER_ID_HERE') { // Replace with actual admin UID
                setIsAdmin(true);
              }
              // Load user's plan and credits from Firestore
              const userRef = dbInstance.collection(`artifacts/${appId}/users/${currentUser.uid}/plan`).doc('details');
              userRef.onSnapshot((docSnap) => {
                if (docSnap.exists) {
                  const data = docSnap.data();
                  setSubscriptionTier(data.tier);
                  setCredits(data.credits);
                } else {
                  setSubscriptionTier('free');
                  setCredits(500); // Initial free credits
                }
              });
            } else {
              // Sign in anonymously for a seamless AI Hub experience
              authInstance.signInAnonymously();
              setUser(null);
              setUserId(null);
              setIsAdmin(false);
            }
          });
          return () => unsubscribe();
        } catch (e) {
          console.error("Firebase initialization error:", e);
        }
      }, []);
    
      const updateSubscription = async (tier, newCredits) => {
        if (!userId || !db) return;
        const userRef = db.collection(`artifacts/${appId}/users/${userId}/plan`).doc('details');
        await userRef.set({ tier, credits: newCredits, lastUpdated: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        setSubscriptionTier(tier);
        setCredits(newCredits);
      };
    
      const navigateTo = (page, data = null) => {
        setCurrentPage(page);
        if (data) {
          setAuditResults(data);
        }
      };
    
      const renderPage = () => {
        switch (currentPage) {
          case 'home':
            return React.createElement(HomePage, { navigateTo: navigateTo, showAuth: () => setShowAuth(true) });
          case 'ai-hub':
            return React.createElement(AIHubPage, { subscriptionTier: subscriptionTier, credits: credits, setCredits: setCredits, navigateTo: navigateTo, userId: userId, db: db, appId: appId, user: user });
          case 'pricing':
            return React.createElement(PricingPage, { setSubscriptionTier: updateSubscription, userId: userId });
          case 'seo-audit-results':
            return React.createElement(SeoAuditResultsPage, { results: auditResults });
          case 'free-growth-plan':
            return React.createElement(FreeGrowthPlanPage, { userId: userId, db: db, appId: appId, user: user });
          case 'admin-panel':
            return React.createElement(AdminPanel, { isAdmin: isAdmin, db: db, appId: appId });
          default:
            return React.createElement(HomePage, { navigateTo: navigateTo, showAuth: () => setShowAuth(true) });
        }
      };
    
      return (
        React.createElement("div", { className: "min-h-screen bg-[#111213] text-white font-sans" },
          React.createElement(Header, { navigateTo: navigateTo, setShowModal: setShowModal, credits: credits, subscriptionTier: subscriptionTier, user: user, auth: auth, isAdmin: isAdmin, setShowAuth: setShowAuth, setIsLogin: setIsLogin }),
          renderPage(),
          React.createElement(Footer, null),
          showModal && React.createElement(BookACallModal, { setShowModal: setShowModal }),
          showAuth && React.createElement(AuthModal, { setShowAuth: setShowAuth, isLogin: isLogin, setIsLogin: setIsLogin, auth: auth })
        )
      );
    };

    // Global Header Component
    const Header = ({ navigateTo, setShowModal, credits, subscriptionTier, user, auth, isAdmin, setShowAuth, setIsLogin }) => {
      const handleLogout = async () => {
        try {
          await auth.signOut();
          window.location.reload();
        } catch (error) {
          console.error("Logout failed:", error);
        }
      };

      return (
        React.createElement("header", { className: "sticky top-0 z-50 bg-[#111213] bg-opacity-90 backdrop-filter backdrop-blur-lg border-b border-gray-700" },
          React.createElement("div", { className: "container mx-auto max-w-7xl px-4 md:px-6 py-4 flex justify-between items-center" },
            React.createElement("h1", { className: "text-2xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Digital Berries"),
            React.createElement("nav", { className: "flex space-x-6 md:space-x-8 items-center" },
              React.createElement("button", { onClick: () => navigateTo('home'), className: "text-gray-300 hover:text-[#00D692] transition-colors font-medium" }, "Home"),
              React.createElement("button", { onClick: () => navigateTo('ai-hub'), className: "text-gray-300 hover:text-[#00D692] transition-colors font-medium" }, "AI Hub"),
              React.createElement("button", { onClick: () => navigateTo('pricing'), className: "text-gray-300 hover:text-[#00D692] transition-colors font-medium" }, "Pricing"),
              isAdmin && React.createElement("button", { onClick: () => navigateTo('admin-panel'), className: "text-red-400 hover:text-red-600 transition-colors font-medium" }, "Admin"),
              user && !user.isAnonymous ? (
                React.createElement(React.Fragment, null,
                  subscriptionTier !== 'pro' && (
                    React.createElement("div", { className: "bg-gray-700 text-gray-300 rounded-full px-3 py-1 text-sm" },
                      "Credits: ", credits
                    )
                  ),
                  React.createElement("button", { onClick: handleLogout, className: "bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-gray-600 transition-colors" }, "Logout")
                )
              ) : (
                React.createElement("button", { onClick: () => { setShowAuth(true); setIsLogin(true); }, className: "bg-[#00D692] text-gray-900 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-opacity-80 transition-opacity" }, "Login / Signup")
              ),
              React.createElement("button", { onClick: () => setShowModal(true), className: "bg-[#00D692] text-gray-900 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-opacity-80 transition-opacity" }, "Book a Call")
            )
          )
        )
      );
    };

    const AuthModal = ({ setShowAuth, isLogin, setIsLogin, auth }) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(false);

      const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
          if (isLogin) {
            await auth.signInWithEmailAndPassword(email, password);
          } else {
            await auth.createUserWithEmailAndPassword(email, password);
          }
          setShowAuth(false);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };

      return (
        React.createElement("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-gray-950 bg-opacity-70 backdrop-blur-sm" },
          React.createElement("div", { className: "bg-gray-800 rounded-3xl p-8 max-w-lg w-full relative" },
            React.createElement("button", { onClick: () => setShowAuth(false), className: "absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" },
              React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
            ),
            React.createElement("h2", { className: "text-3xl font-bold mb-4", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, isLogin ? 'Login' : 'Signup'),
            React.createElement("p", { className: "text-gray-400 mb-6" }, isLogin ? 'Sign in to access your saved data and tools.' : 'Create an account to start your journey.'),
            
            React.createElement("form", { onSubmit: handleAuth, className: "space-y-4" },
              React.createElement("div", null,
                React.createElement("label", { htmlFor: "email", className: "block text-gray-300 mb-1" }, "Email Address"),
                React.createElement("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all" })
              ),
              React.createElement("div", null,
                React.createElement("label", { htmlFor: "password", className: "block text-gray-300 mb-1" }, "Password"),
                React.createElement("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all" })
              ),
              error && React.createElement("div", { className: "text-red-400 text-sm" }, error),
              React.createElement("button", {
                type: "submit",
                className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full shadow-lg hover:bg-opacity-80 transition-opacity disabled:bg-gray-500 disabled:cursor-not-allowed",
                disabled: loading
              }, isLogin ? 'Login' : 'Signup'),
              React.createElement("button", { type: "button", onClick: () => setIsLogin(!isLogin), className: "w-full mt-2 text-gray-400 text-sm hover:underline" }, isLogin ? 'Need an account? Signup here.' : 'Already have an account? Login here.')
            )
          )
        )
      );
    };

    const AdminPanel = ({ isAdmin, db, appId }) => {
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        if (!isAdmin || !db) return;
        const usersRef = db.collection(`artifacts/${appId}/users`);
        const unsubscribe = usersRef.onSnapshot(async (snapshot) => {
          const userPromises = snapshot.docs.map(async (doc) => {
            const userId = doc.id;
            const planDoc = await usersRef.doc(userId).collection('plan').doc('details').get();
            const planData = planDoc.exists ? planDoc.data() : { tier: 'free', credits: 'N/A' };
            return { id: userId, plan: planData.tier, credits: planData.credits };
          });
          const userList = await Promise.all(userPromises);
          setUsers(userList);
          setLoading(false);
        });
        return () => unsubscribe();
      }, [isAdmin, db, appId]);

      if (!isAdmin) {
        return React.createElement("div", { className: "p-12 text-center" }, "Access Denied: You must be an administrator to view this page.");
      }

      return (
        React.createElement("div", { className: "p-6 md:p-12 min-h-screen" },
          React.createElement("div", { className: "container mx-auto max-w-7xl" },
            React.createElement("h1", { className: "text-4xl md:text-5xl font-bold mb-8", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Admin Panel"),
            loading ? (
              React.createElement("div", { className: "text-center" }, "Loading user data...")
            ) : (
              React.createElement("div", { className: "bg-gray-900 rounded-3xl p-6 md:p-10 border border-gray-700 overflow-x-auto" },
                React.createElement("table", { className: "w-full text-left table-auto" },
                  React.createElement("thead", null,
                    React.createElement("tr", { className: "border-b border-gray-700" },
                      React.createElement("th", { className: "py-3 px-4" }, "User ID"),
                      React.createElement("th", { className: "py-3 px-4" }, "Plan"),
                      React.createElement("th", { className: "py-3 px-4" }, "Credits")
                    )
                  ),
                  React.createElement("tbody", null,
                    users.map((user) => (
                      React.createElement("tr", { key: user.id, className: "border-b border-gray-800" },
                        React.createElement("td", { className: "py-3 px-4" }, user.id),
                        React.createElement("td", { className: "py-3 px-4" }, user.plan),
                        React.createElement("td", { className: "py-3 px-4" }, user.credits)
                      )
                    ))
                  )
                )
              )
            )
          )
        )
      );
    };

    // Global Footer Component
    const Footer = () => {
      return (
        React.createElement("footer", { className: "bg-gray-900 py-8 mt-16" },
          React.createElement("div", { className: "container mx-auto max-w-7xl px-4 text-center text-gray-400" },
            React.createElement("p", null, "Creativity × Data × AI — Growth you can feel."),
            React.createElement("p", { className: "mt-4 text-sm" }, "© 2025 Digital Berries. All rights reserved.")
          )
        )
      );
    };
    
    const BookACallModal = ({ setShowModal }) => {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [message, setMessage] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [submissionStatus, setSubmissionStatus] = useState(null);
    
      const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
          console.log('--- BOOK A CALL REQUEST ---');
          console.log(`From: ${name}`);
          console.log(`Email: ${email}`);
          console.log('Customer data sent to: DIGITALBERRIES786@GMAIL.COM');
          console.log(`Confirmation email sent to: ${email}`);
          console.log('--- END OF REQUEST ---');
    
          setSubmissionStatus('success');
          setIsSubmitting(false);
          setTimeout(() => setShowModal(false), 2000);
        }, 1500);
      };
    
      return (
        React.createElement("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-gray-950 bg-opacity-70 backdrop-blur-sm" },
          React.createElement("div", { className: "bg-gray-800 rounded-3xl p-8 max-w-lg w-full relative" },
            React.createElement("button", { onClick: () => setShowModal(false), className: "absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" },
              React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
            ),
            React.createElement("h2", { className: "text-3xl font-bold mb-4", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Book a Strategy Call"),
            React.createElement("p", { className: "text-gray-400 mb-6" }, "Let's discuss how we can accelerate your digital growth."),
            
            submissionStatus === 'success' ? (
              React.createElement("div", { className: "text-center py-10" },
                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-20 w-20 text-[#00D692] mx-auto mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })),
                React.createElement("p", { className: "text-lg font-semibold text-gray-200" }, "Request Sent!"),
                React.createElement("p", { className: "text-gray-400" }, "We'll be in touch shortly.")
              )
            ) : (
              React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
                React.createElement("div", null,
                  React.createElement("label", { htmlFor: "name", className: "block text-gray-300 mb-1" }, "Full Name"),
                  React.createElement("input", { type: "text", id: "name", value: name, onChange: (e) => setName(e.target.value), required: true, className: "w-full bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all" })
                ),
                React.createElement("div", null,
                  React.createElement("label", { htmlFor: "email", className: "block text-gray-300 mb-1" }, "Email Address"),
                  React.createElement("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all" })
                ),
                React.createElement("div", null,
                  React.createElement("label", { htmlFor: "message", className: "block text-gray-300 mb-1" }, "Your Message (optional)"),
                  React.createElement("textarea", { id: "message", value: message, onChange: (e) => setMessage(e.target.value), rows: "4", className: "w-full bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all" })
                ),
                React.createElement("button", {
                  type: "submit",
                  className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full shadow-lg hover:bg-opacity-80 transition-opacity disabled:bg-gray-500 disabled:cursor-not-allowed",
                  disabled: isSubmitting
                }, isSubmitting ? 'Sending...' : 'Schedule Meeting')
              )
            )
          )
        )
      );
    };


    // --- Homepage Component ---
    const HomePage = ({ navigateTo }) => {
      return (
        React.createElement("div", { className: "p-6 md:p-12" },
          React.createElement("div", { className: "container mx-auto max-w-7xl" },
            React.createElement("div", { className: "text-center py-20 hero-animated" },
              React.createElement("h1", { className: "text-4xl md:text-7xl font-bold mb-4", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Build a brand the internet can't ignore."),
              React.createElement("p", { className: "text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8" }, "Harness the power of AI to supercharge your digital presence. We blend creativity with data to deliver growth you can feel."),
              React.createElement("div", { className: "flex justify-center space-x-4" },
                React.createElement("button", { onClick: () => navigateTo('free-growth-plan'), className: "bg-[#00D692] text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-80 transition-opacity" }, "Get a Free Growth Plan"),
                React.createElement("button", { onClick: () => navigateTo('ai-hub'), className: "bg-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-600 transition-colors" }, "Try AI Tools")
              )
            ),

            /* Services Section */
            React.createElement("div", { className: "my-20" },
              React.createElement("h2", { className: "text-3xl md:text-4xl font-bold text-center mb-12" }, "Our Core Services"),
              React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" },
                React.createElement(ServiceCard, { title: "Social Media Marketing", description: "Engage your audience with captivating content and powerful campaigns." }),
                React.createElement(ServiceCard, { title: "Website Development", description: "Craft high-performing, beautiful websites that convert visitors into customers." }),
                React.createElement(ServiceCard, { title: "Performance Marketing", description: "Drive maximum ROI and ROAS with data-driven ad strategies on Meta and Google." }),
                React.createElement(ServiceCard, { title: "Content Creation", description: "Develop compelling, SEO-optimized content that tells your brand's story." }),
                React.createElement(ServiceCard, { title: "SEO & SEM", description: "Achieve top rankings and dominate search results with our expert strategies." }),
                React.createElement(ServiceCard, { title: "Celebrity & Influencer Marketing", description: "Partner with top influencers to amplify your brand's reach and credibility." })
              )
            ),

            /* AI Hub Preview Section */
            React.createElement("div", { className: "my-20" },
              React.createElement("h2", { className: "text-3xl md:text-4xl font-bold text-center mb-12" }, "AI Tools for Digital Marketers"),
              React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" },
                React.createElement(ToolCard, { title: "Ask Digital Berries", description: "Your AI-powered marketing consultant.", onClick: () => navigateTo('ai-hub') }),
                React.createElement(ToolCard, { title: "Reel Script Generator", description: "Craft viral-ready scripts in seconds.", onClick: () => navigateTo('ai-hub') }),
                React.createElement(ToolCard, { title: "Ad Copy Studio", description: "Generate high-converting ad copy instantly.", onClick: () => navigateTo('ai-hub') })
              ),
              React.createElement("div", { className: "text-center mt-12" },
                React.createElement("button", { onClick: () => navigateTo('ai-hub'), className: "bg-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-600 transition-colors" }, "View All AI Tools")
              )
            )
          )
        )
      );
    };

    const FreeGrowthPlanPage = ({ userId, db, appId, user }) => {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [business, setBusiness] = useState('');
      const [plan, setPlan] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [submissionStatus, setSubmissionStatus] = useState(null);

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setPlan('');

        const aiResponse = await fetchAIResponse(`Generate a short, free business plan for a business named "${business}" founded by "${name}".`);
        setPlan(aiResponse);

        setTimeout(() => {
          console.log('--- FREE GROWTH PLAN REQUEST ---');
          console.log(`Customer Name: ${name}`);
          console.log(`Business Name: ${business}`);
          console.log('User data submitted to: DIGITALBERRIES786@GMAIL.COM');
          console.log('--- END OF REQUEST ---');
          setSubmissionStatus('success');
          setIsSubmitting(false);
        }, 1500);
      };

      return (
        React.createElement("div", { className: "p-6 md:p-12 min-h-screen" },
          React.createElement("div", { className: "container mx-auto max-w-lg text-center" },
            React.createElement("h1", { className: "text-4xl md:text-5xl font-bold mb-4", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Get Your Free Growth Plan"),
            React.createElement("p", { className: "text-lg text-gray-300 mb-8" }, "Fill out the form below to receive a personalized growth plan from our AI-powered team."),
            React.createElement("div", { className: "bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700" },
              submissionStatus === 'success' ? (
                React.createElement("div", { className: "text-center py-10" },
                  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-20 w-20 text-[#00D692] mx-auto mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })),
                  React.createElement("p", { className: "text-lg font-semibold text-gray-200" }, "Request Sent!"),
                  React.createElement("p", { className: "text-gray-400" }, "Your personalized growth plan is on its way."),
                  plan && React.createElement("div", { className: "mt-6 bg-gray-800 p-4 rounded-xl text-left" },
                    React.createElement("h3", { className: "text-xl font-bold text-white mb-2" }, "Your Free Business Plan:"),
                    React.createElement("p", { className: "text-gray-300 whitespace-pre-wrap" }, plan)
                  )
                )
              ) : (
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
                  React.createElement("div", null,
                    React.createElement("label", { htmlFor: "name", className: "block text-gray-300 mb-1 text-left" }, "Your Name"),
                    React.createElement("input", { type: "text", id: "name", value: name, onChange: (e) => setName(e.target.value), required: true, className: "w-full bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all" })
                  ),
                  React.createElement("div", null,
                    React.createElement("label", { htmlFor: "business", className: "block text-gray-300 mb-1 text-left" }, "Your Business"),
                    React.createElement("input", { type: "text", id: "business", value: business, onChange: (e) => setBusiness(e.target.value), required: true, className: "w-full bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all" })
                  ),
                  React.createElement("button", {
                    type: "submit",
                    className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full shadow-lg hover:bg-opacity-80 transition-opacity disabled:bg-gray-500 disabled:cursor-not-allowed",
                    disabled: isSubmitting
                  }, isSubmitting ? 'Submitting...' : 'Get My Free Plan')
                )
              )
            )
          )
        )
      );
    };

    const ServiceCard = ({ title, description }) => {
      return (
        React.createElement("div", { className: "bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-700 transform hover:scale-105 transition-transform duration-300" },
          React.createElement("h3", { className: "text-xl font-bold mb-2", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, title),
          React.createElement("p", { className: "text-gray-400" }, description)
        )
      );
    };

    const ToolCard = ({ title, description, onClick }) => {
      return (
        React.createElement("div", { className: "bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-700 transform hover:scale-105 transition-transform duration-300 cursor-pointer card-animated", onClick: onClick },
          React.createElement("h3", { className: "text-xl font-bold mb-2", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, title),
          React.createElement("p", { className: "text-gray-400" }, description)
        )
      );
    };

    // --- Pricing Page Component ---
    const PricingPage = ({ setSubscriptionTier, userId }) => {
      const handlePayment = (tier) => {
        let url = '';
        let credits = 0;
        if (!userId) {
          alert('Please login or signup to purchase a plan.');
          return;
        }

        if (tier === 'standard') {
          url = 'https://rzp.io/rzp/GVfY1CXs';
          credits = 4000;
          console.log(`Simulating payment for Standard plan. Redirecting to: ${url}`);
        } else if (tier === 'pro') {
          url = 'https://rzp.io/rzp/k751136';
          credits = 10000;
          console.log(`Simulating payment for Pro plan. Redirecting to: ${url}`);
        } else if (tier === 'business') {
          console.log(`Contacting sales team for business plan.`);
          return;
        }
        setSubscriptionTier(tier, credits);
      };

      return (
        React.createElement("div", { className: "p-6 md:p-12 min-h-screen" },
          React.createElement("div", { className: "container mx-auto max-w-4xl text-center" },
            React.createElement("h2", { className: "text-4xl md:text-5xl font-bold mb-4", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Pricing & Plans"),
            React.createElement("p", { className: "text-lg md:text-xl text-gray-300 mb-12" }, "Choose the plan that fits your growth goals."),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8" },
              React.createElement(PricingCard, {
                title: "Free",
                price: "₹0",
                description: "Limited access to our core tools.",
                features: ['Access to Ask Digital Berries', '500 credits per month'],
                onClick: () => setSubscriptionTier('free', 500),
                buttonText: "Choose Plan"
              }),
              React.createElement(PricingCard, {
                title: "Standard",
                price: "₹499/mo",
                description: "Unlock a powerful suite of AI tools.",
                features: ['All Standard AI Tools', '4000 credits per month', 'Email support'],
                onClick: () => handlePayment('standard'),
                buttonText: "Go Standard"
              }),
              React.createElement(PricingCard, {
                title: "Pro",
                price: "₹699/mo",
                description: "All the power of our AI, unlimited.",
                features: ['All AI Tools Unlocked', '10000 credits per month', 'Priority support'],
                onClick: () => handlePayment('pro'),
                buttonText: "Go Pro",
                isPrimary: true
              }),
              React.createElement(PricingCard, {
                title: "Business",
                price: "Contact for pricing",
                description: "For agencies and large businesses.",
                features: ['Custom credit limits', 'Dedicated account manager', 'API access', 'Custom integrations'],
                onClick: () => handlePayment('business'),
                buttonText: "Contact Sales"
              })
            )
          )
        )
      );
    };

    const PricingCard = ({ title, price, description, features, onClick, buttonText, isPrimary = false }) => {
      return (
        React.createElement("div", { className: `rounded-3xl p-8 shadow-2xl border border-gray-700 transition-all duration-300 ${isPrimary ? 'bg-gray-800 scale-105' : 'bg-gray-900'}` },
          React.createElement("h3", { className: "text-2xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, title),
          React.createElement("p", { className: "text-4xl font-bold mt-4 mb-2" }, price),
          React.createElement("p", { className: "text-gray-400 mb-6" }, description),
          React.createElement("ul", { className: "text-left space-y-2 mb-8 text-gray-300" },
            features.map((feature, index) => (
              React.createElement("li", { key: index, className: "flex items-center space-x-2" },
                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-[#00D692] flex-shrink-0", viewBox: "0 0 20 20", fill: "currentColor" },
                  React.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" })
                ),
                React.createElement("span", null, feature)
              )
            ))
          ),
          React.createElement("button", {
            onClick: onClick,
            className: `w-full font-bold py-3 rounded-full transition-all duration-300 shadow-lg ${
              isPrimary
                ? 'bg-[#00D692] text-gray-900 hover:bg-opacity-80'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`
          }, buttonText)
        )
      );
    };

    // --- SEO Audit Results Page ---
    const SeoAuditResultsPage = ({ results }) => {
      if (!results) {
        return (
          React.createElement("div", { className: "p-6 md:p-12 min-h-screen text-center" },
            React.createElement("div", { className: "container mx-auto max-w-7xl" },
              React.createElement("h2", { className: "text-4xl font-bold mb-4" }, "No Audit Results Found"),
              React.createElement("p", { className: "text-lg text-gray-400" }, "Please go back and run an audit from the AI Hub.")
            )
          )
        );
      }

      const handleDownload = () => {
        const content = "Digital Berries SEO Audit Report\n\n" + results;
        console.log("Simulating PDF download of SEO Audit Report with Digital Berries watermark.");
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DigitalBerries_SEO_Audit.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      const parseReport = (text) => {
        const lines = text.split('\n');
        const parsed = { score: null, sections: [] };
        let currentSection = null;
        for (const line of lines) {
          if (line.includes('Website Score')) {
            parsed.score = line.match(/\d+/)[0];
          } else if (line.startsWith('###')) {
            if (currentSection) {
              parsed.sections.push(currentSection);
            }
            currentSection = { title: line.substring(3).trim(), points: [] };
          } else if (line.startsWith('*') && currentSection) {
            currentSection.points.push(line.substring(1).trim());
          }
        }
        if (currentSection) {
          parsed.sections.push(currentSection);
        }
        return parsed;
      };

      const parsedResults = parseReport(results);

      return (
        React.createElement("div", { className: "p-6 md:p-12 min-h-screen" },
          React.createElement("div", { className: "container mx-auto max-w-7xl" },
            React.createElement("h1", { className: "text-4xl md:text-5xl font-bold mb-8 text-center", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "SEO Audit Report"),
            React.createElement("div", { className: "bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-700" },
              parsedResults.score && React.createElement("div", { className: "text-center mb-8" },
                React.createElement("h2", { className: "text-7xl font-bold text-[#00D692]" }, parsedResults.score),
                React.createElement("p", { className: "text-lg text-gray-400" }, "Website Score (out of 100)")
              ),
              parsedResults.sections.map((section, index) => (
                React.createElement("div", { key: index, className: "mb-8" },
                  React.createElement("h3", { className: "text-2xl font-bold text-white mb-4" }, section.title),
                  React.createElement("ul", { className: "list-disc list-inside space-y-2 text-gray-400" },
                    section.points.map((point, i) => React.createElement("li", { key: i }, point))
                  )
                )
              )),
              React.createElement("button", { onClick: handleDownload, className: "mt-8 w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg" }, "Download Report as PDF")
            )
          )
        )
      );
    };

    // --- AI Hub Page with Real AI Connection ---
    const AIHubPage = ({ subscriptionTier, credits, setCredits, navigateTo, userId, db, appId, user }) => {
      const [activeTool, setActiveTool] = useState('AskDigitalBerries');

      const consumeCredits = async (amount) => {
        if (!user) {
          alert("You must be logged in to use this tool.");
          return false;
        }
        if (user.isAnonymous) {
          alert("You are using a temporary guest account. Please sign up or log in to a real account to save your work.");
        }
        if (subscriptionTier === 'pro' || subscriptionTier === 'business') return true;
        if (credits >= amount) {
          const newCredits = credits - amount;
          setCredits(newCredits);
          if (!user.isAnonymous && userId) {
            const userRef = db.collection(`artifacts/${appId}/users/${userId}/plan`).doc('details');
            await userRef.set({ credits: newCredits }, { merge: true });
          }
          return true;
        }
        alert("Not enough credits to perform this action. Please upgrade your plan.");
        return false;
      };

      const toolProps = {
        consumeCredits,
        isProTier: subscriptionTier === 'pro',
        isStandardTier: subscriptionTier === 'standard' || subscriptionTier === 'pro',
        navigateTo,
        userId,
        db,
        appId
      };

      const renderToolComponent = () => {
        if (!user) {
          return React.createElement(NotLoggedInOverlay, null);
        }
        switch (activeTool) {
          case 'AskDigitalBerries':
            return React.createElement(AskDigitalBerries, { ...toolProps });
          case 'SocialMediaChecker':
            return React.createElement(SocialMediaChecker, { ...toolProps });
          case 'ReelScriptGenerator':
            return React.createElement(ReelScriptGenerator, { ...toolProps });
          case 'YouTubeScriptWriter':
            return React.createElement(YouTubeScriptWriter, { ...toolProps });
          case 'AdCopyStudio':
            return React.createElement(AdCopyStudio, { ...toolProps });
          case 'SeoQuickAudit':
            return React.createElement(SeoQuickAudit, { ...toolProps });
          case 'WebsiteBuilder':
            return React.createElement(WebsiteBuilder, { ...toolProps });
          case 'ImageCaptionGenerator':
            return React.createElement(ImageCaptionGenerator, { ...toolProps });
          case 'MetaAdsBuilder':
            return React.createElement(MetaAdsBuilder, { ...toolProps });
          case 'ContentPlanner':
            return React.createElement(ContentPlanner, { ...toolProps });
          case 'ImageGenerator':
            return React.createElement(ImageGenerator, { ...toolProps });
          case 'BrandTaglineGenerator':
            return React.createElement(BrandTaglineGenerator, { ...toolProps });
          default:
            return null;
        }
      };

      return (
        React.createElement("div", { className: "p-6 md:p-12 min-h-screen" },
          React.createElement("div", { className: "container mx-auto max-w-7xl" },
            React.createElement("h1", { className: "text-4xl md:text-5xl font-bold mb-8 text-center", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Digital Berries AI Hub"),
            React.createElement("p", { className: "text-center text-lg md:text-xl text-gray-300 mb-12" }, "Your creative partner powered by high-end AI."),
            React.createElement("div", { className: "bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-700" },
              React.createElement("div", { className: "flex flex-wrap justify-center mb-8 gap-4 md:gap-6" },
                React.createElement(TabButton, { title: "Ask DB", onClick: () => setActiveTool('AskDigitalBerries'), isActive: activeTool === 'AskDigitalBerries' }),
                React.createElement(TabButton, { title: "Social Checker", onClick: () => setActiveTool('SocialMediaChecker'), isActive: activeTool === 'SocialMediaChecker', isLocked: !toolProps.isStandardTier }),
                React.createElement(TabButton, { title: "Reel Script", onClick: () => setActiveTool('ReelScriptGenerator'), isActive: activeTool === 'ReelScriptGenerator', isLocked: !toolProps.isStandardTier }),
                React.createElement(TabButton, { title: "Ad Copy", onClick: () => setActiveTool('AdCopyStudio'), isActive: activeTool === 'AdCopyStudio', isLocked: !toolProps.isStandardTier }),
                React.createElement(TabButton, { title: "SEO Audit", onClick: () => setActiveTool('SeoQuickAudit'), isActive: activeTool === 'SeoQuickAudit', isLocked: !toolProps.isStandardTier }),
                React.createElement(TabButton, { title: "Website Builder", onClick: () => setActiveTool('WebsiteBuilder'), isActive: activeTool === 'WebsiteBuilder', isLocked: !toolProps.isProTier }),
                React.createElement(TabButton, { title: "Image Caption", onClick: () => setActiveTool('ImageCaptionGenerator'), isActive: activeTool === 'ImageCaptionGenerator', isLocked: !toolProps.isStandardTier }),
                React.createElement(TabButton, { title: "Meta Ads", onClick: () => setActiveTool('MetaAdsBuilder'), isActive: activeTool === 'MetaAdsBuilder', isLocked: !toolProps.isProTier }),
                React.createElement(TabButton, { title: "Content Planner", onClick: () => setActiveTool('ContentPlanner'), isActive: activeTool === 'ContentPlanner', isLocked: !toolProps.isStandardTier }),
                React.createElement(TabButton, { title: "Image Generator", onClick: () => setActiveTool('ImageGenerator'), isActive: activeTool === 'ImageGenerator', isLocked: !toolProps.isProTier }),
                React.createElement(TabButton, { title: "Brand Tagline", onClick: () => setActiveTool('BrandTaglineGenerator'), isActive: activeTool === 'BrandTaglineGenerator', isLocked: !toolProps.isStandardTier })
              ),
              React.createElement("div", { className: "bg-gray-800 rounded-2xl p-6" },
                renderToolComponent()
              )
            )
          )
        )
      );
    };

    const TabButton = ({ title, onClick, isActive, isLocked = false }) => (
      React.createElement("button", {
        onClick: onClick,
        className: `flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 relative ${
          isActive ? 'bg-[#00D692] text-gray-900 shadow-lg' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`,
        disabled: isLocked
      },
        React.createElement("span", null, title),
        isLocked && (
          React.createElement("span", { className: "absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-bold" }, "LOCKED")
        )
      )
    );

    const LockedToolOverlay = () => (
      React.createElement("div", { className: "absolute inset-0 bg-gray-950 bg-opacity-70 flex flex-col items-center justify-center rounded-2xl z-10" },
        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 text-gray-400 mb-4", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement("path", { d: "M12 2C8.686 2 6 4.686 6 8v4h-2a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2v-8a2 2 0 00-2-2h-2V8c0-3.314-2.686-6-6-6zm-4 6c0-2.206 1.794-4 4-4s4 1.794 4 4v4H8V8z"})),
        React.createElement("p", { className: "text-xl font-bold text-gray-300" }, "Upgrade your plan to unlock this tool.")
      )
    );

    const fetchAIResponse = async (prompt, imageBase64 = null) => {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const parts = [{ text: prompt }];
      if (imageBase64) {
        parts.push({ inlineData: { mimeType: "image/png", data: imageBase64 } });
      }

      const payload = { contents: [{ parts: parts }] };
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text.replace(/\*/g, '') || "I am unable to generate a response at this time. Please try again.";
      } catch (error) {
        console.error("Failed to fetch AI response:", error);
        return `Failed to get a response. Error: ${error.message}`;
      }
    };

    const fetchImage = async (imagePrompt) => {
      const payload = { instances: { prompt: imagePrompt }, parameters: { "sampleCount": 4} };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const result = await response.json();
        if (result.predictions && result.predictions.length > 0) {
          return result.predictions.map(p => `data:image/png;base64,${p.bytesBase64Encoded}`);
        } else {
          throw new Error('Image generation failed. No data received.');
        }
      } catch (error) {
        console.error("Failed to generate image:", error);
        return null;
      }
    };

    const AskDigitalBerries = ({ consumeCredits, userId, db, appId }) => {
      const [prompt, setPrompt] = useState('');
      const [loading, setLoading] = useState(false);
      const [chatHistory, setChatHistory] = useState([]);
      const chatEndRef = useRef(null);

      useEffect(() => {
        if (!userId || !db) return;
        const chatCollection = db.collection(`artifacts/${appId}/users/${userId}/ask-db`);
        const unsubscribe = chatCollection.onSnapshot((snapshot) => {
          const messages = snapshot.docs.map(doc => doc.data());
          messages.sort((a, b) => a.timestamp?.toMillis() - b.timestamp?.toMillis());
          setChatHistory(messages);
        }, (error) => {
          console.error("Error fetching chat history:", error);
        });
        return () => unsubscribe();
      }, [userId, db, appId]);

      useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [chatHistory, loading]);

      const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || !userId) return;
        if (!(await consumeCredits(50))) {
          alert("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }

        setLoading(true);
        const userMessage = { text: prompt, sender: 'user', timestamp: firebase.firestore.FieldValue.serverTimestamp() };
        await db.collection(`artifacts/${appId}/users/${userId}/ask-db`).doc(`msg-${Date.now()}-user`).set(userMessage);
        setPrompt('');

        const aiResponse = await fetchAIResponse(`Act as a world-class digital marketing, AI, and coding expert. Provide a comprehensive and expert response. The conversation history is: ${chatHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}\nUser: ${prompt}`);
        const aiMessage = { text: aiResponse, sender: 'ai', timestamp: firebase.firestore.FieldValue.serverTimestamp() };
        await db.collection(`artifacts/${appId}/users/${userId}/ask-db`).doc(`msg-${Date.now()}-ai`).set(aiMessage);
        setLoading(false);
      };

      const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && userId) {
          if (!(await consumeCredits(50))) {
            alert("Not enough credits to perform this action. Please upgrade your plan.");
            return;
          }
          setLoading(true);
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = reader.result.split(',')[1];
            const userMessage = { text: `User uploaded an image.`, sender: 'user', timestamp: firebase.firestore.FieldValue.serverTimestamp(), image: reader.result };
            await db.collection(`artifacts/${appId}/users/${userId}/ask-db`).doc(`msg-${Date.now()}-user`).set(userMessage);
            
            const aiResponse = await fetchAIResponse(`Analyze this image and provide a professional, in-depth analysis.`, base64);
            const aiMessage = { text: aiResponse, sender: 'ai', timestamp: firebase.firestore.FieldValue.serverTimestamp() };
            await db.collection(`artifacts/${appId}/users/${userId}/ask-db`).doc(`msg-${Date.now()}-ai`).set(aiMessage);
            setLoading(false);
          };
          reader.readAsDataURL(file);
        }
      };

      return (
        React.createElement("div", { className: "space-y-6 flex flex-col h-[60vh] max-h-[700px] relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Ask Digital Berries"),
          React.createElement("p", { className: "text-gray-400" }, "Your conversational AI partner for all things digital marketing."),
          
          React.createElement("div", { className: "flex-grow overflow-y-auto pr-2 custom-scrollbar" },
            React.createElement("div", { className: "flex flex-col space-y-4" },
              chatHistory.map((msg, index) => (
                React.createElement("div", { key: index, className: `flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}` },
                  React.createElement("div", { className: `p-4 rounded-3xl max-w-[80%] ${msg.sender === 'user' ? 'bg-[#00D692] text-gray-900' : 'bg-gray-700 text-white'}` },
                    msg.image && React.createElement("img", { src: msg.image, alt: "user upload", className: "rounded-xl max-w-full mb-2" }),
                    React.createElement("p", { className: "whitespace-pre-wrap" }, msg.text)
                  )
                )
              )),
              loading && (
                React.createElement("div", { className: "flex justify-start" },
                  React.createElement("div", { className: "p-4 rounded-3xl bg-gray-700 text-white" },
                    React.createElement("div", { className: "dot-flashing" })
                  )
                )
              ),
              React.createElement("div", { ref: chatEndRef })
            )
          ),
          
          React.createElement("form", { onSubmit: handleSendMessage, className: "relative mt-4 flex items-center space-x-2" },
            React.createElement("label", { className: "cursor-pointer text-gray-300 hover:text-[#00D692]" },
              React.createElement("input", { type: "file", accept: "image/*", onChange: handleFileChange, className: "hidden", disabled: loading }),
              React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }))
            ),
            React.createElement("input", {
              type: "text",
              className: "w-full bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "Type your message...",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: loading
            }),
            React.createElement("button", { type: "submit", className: "bg-[#00D692] text-gray-900 p-3 rounded-full hover:bg-opacity-80 transition-opacity disabled:bg-gray-500 disabled:cursor-not-allowed", disabled: loading },
              React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }))
            )
          )
        )
      );
    };

    const SocialMediaChecker = ({ consumeCredits, isStandardTier }) => {
      const [prompt, setPrompt] = useState('');
      const [report, setReport] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleGenerate = async () => {
        if (!isStandardTier || !prompt) return;
        if (!(await consumeCredits(300))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setLoading(true);
        setError(null);
        setReport(null);

        const aiResponse = await fetchAIResponse(`Generate a detailed social media profile analysis for the user or business "${prompt}", covering key platforms like Instagram, YouTube, Facebook, and LinkedIn. The report should be a JSON object with keys like 'overview', 'instagram', 'youtube', 'facebook', 'linkedin'. For each platform, provide simulated data for 'followers', 'engagementRate', 'estimatedEarnings', and 'topHashtags'. The data should be formatted as a professional analysis.`);

        try {
          const data = JSON.parse(aiResponse);
          setReport(data);
        } catch (e) {
          setError("Failed to parse the AI response. Please try a different query.");
        } finally {
          setLoading(false);
        }
      };

      const renderPlatformReport = (platformName, data) => (
        React.createElement("div", { className: "bg-gray-700 p-6 rounded-xl space-y-4" },
          React.createElement("h4", { className: "text-2xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #B5179E, #7B2CBF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, platformName),
          data.followers && React.createElement("p", { className: "text-gray-300" }, "Followers: ", React.createElement("span", { className: "font-bold text-white" }, data.followers)),
          data.engagementRate && React.createElement("p", { className: "text-gray-300" }, "Engagement Rate: ", React.createElement("span", { className: "font-bold text-white" }, data.engagementRate)),
          data.estimatedEarnings && React.createElement("p", { className: "text-gray-300" }, "Estimated Earnings: ", React.createElement("span", { className: "font-bold text-white" }, data.estimatedEarnings)),
          data.topHashtags && React.createElement("div", null,
            React.createElement("p", { className: "text-gray-300 font-bold mt-2" }, "Top Hashtags:"),
            React.createElement("div", { className: "flex flex-wrap gap-2 mt-2" },
              data.topHashtags.map((tag, i) => React.createElement("span", { key: i, className: "bg-gray-800 text-[#00D692] text-xs px-2 py-1 rounded-full" }, tag))
            )
          )
        )
      );

      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Social Media Checker"),
          React.createElement("p", { className: "text-gray-400" }, "Get a professional, in-depth analysis of any social media profile. (300 credits per audit)"),
          React.createElement("div", { className: "relative" },
            React.createElement("input", {
              type: "text",
              className: "w-full bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "e.g., @digitalberries",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: !isStandardTier
            })
          ),
          React.createElement("button", {
            className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
            onClick: handleGenerate,
            disabled: loading || !isStandardTier
          }, loading ? 'Analyzing...' : 'Analyze Profile'),
          loading && React.createElement("div", { className: "text-center mt-4" }, "Analyzing profile..."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          report && (
            React.createElement("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" },
              report.instagram && renderPlatformReport('Instagram', report.instagram),
              report.youtube && renderPlatformReport('YouTube', report.youtube),
              report.facebook && renderPlatformReport('Facebook', report.facebook),
              report.linkedin && renderPlatformReport('LinkedIn', report.linkedin)
            )
          ),
          !isStandardTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const ReelScriptGenerator = ({ consumeCredits, isStandardTier, userId, db, appId }) => {
      const [prompt, setPrompt] = useState('');
      const [response, setResponse] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleGenerate = async () => {
        if (!isStandardTier) return;
        if (!(await consumeCredits(50))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setLoading(true);
        setError(null);
        setResponse('');
        const aiResponse = await fetchAIResponse(`Generate a 15-second reel script with a hook, a problem, a solution, and a CTA for the niche: "${prompt}".`);
        setResponse(aiResponse);
        setLoading(false);
      };
      
      const handleDownload = () => {
        const content = "Digital Berries Reel Script\n\n" + response;
        console.log("Simulating PDF download of Reel Script with Digital Berries watermark.");
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DigitalBerries_ReelScript.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Reel Script Generator"),
          React.createElement("p", { className: "text-gray-400" }, "Craft viral-ready reel scripts in seconds. (50 credits per use)"),
          React.createElement("div", { className: "relative" },
            React.createElement("input", {
              type: "text",
              className: "w-full bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "e.g., Skincare, SaaS, E-commerce",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: !isStandardTier
            })
          ),
          React.createElement("button", {
            className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
            onClick: handleGenerate,
            disabled: loading || !isStandardTier
          }, loading ? 'Generating...' : 'Generate Script'),
          loading && React.createElement("div", { className: "text-center mt-4" }, "Generating..."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          response && (
            React.createElement("div", { className: "bg-gray-900 rounded-xl p-6 border border-gray-700 mt-6" },
              React.createElement("p", { className: "text-gray-300 whitespace-pre-wrap" }, response),
              React.createElement("button", { onClick: handleDownload, className: "mt-4 w-full bg-gray-700 text-white font-bold py-2 rounded-full hover:bg-gray-600" }, "Download Script")
            )
          ),
          !isStandardTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const YouTubeScriptWriter = ({ consumeCredits, isStandardTier }) => {
      const [prompt, setPrompt] = useState('');
      const [response, setResponse] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleGenerate = async () => {
        if (!isStandardTier) return;
        if (!(await consumeCredits(50))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setLoading(true);
        setError(null);
        setResponse('');
        const aiResponse = await fetchAIResponse(`Write a YouTube video script outline for the topic: "${prompt}". Include a hook, a few main points, and a strong CTA.`);
        setResponse(aiResponse);
        setLoading(false);
      };

      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "YouTube Script Writer"),
          React.createElement("p", { className: "text-gray-400" }, "Instantly generate a script outline for your next video. (50 credits per use)"),
          React.createElement("div", { className: "relative" },
            React.createElement("input", {
              type: "text",
              className: "w-full bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "e.g., 5 ways to get more website traffic",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: !isStandardTier
            })
          ),
          React.createElement("button", {
            className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
            onClick: handleGenerate,
            disabled: loading || !isStandardTier
          }, loading ? 'Writing...' : 'Generate Script'),
          loading && React.createElement("div", { className: "text-center mt-4" }, "Writing..."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          response && (
            React.createElement("div", { className: "bg-gray-900 rounded-xl p-6 border border-gray-700 mt-6" },
              React.createElement("p", { className: "text-gray-300 whitespace-pre-wrap" }, response)
            )
          ),
          !isStandardTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const AdCopyStudio = ({ consumeCredits, isStandardTier }) => {
      const [prompt, setPrompt] = useState('');
      const [response, setResponse] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleGenerate = async () => {
        if (!isStandardTier) return;
        if (!(await consumeCredits(50))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setLoading(true);
        setError(null);
        setResponse('');
        const aiResponse = await fetchAIResponse(`Generate 3 ad copy variants for a product named "${prompt}". Include a catchy headline, a short description, and a clear call to action.`);
        setResponse(aiResponse);
        setLoading(false);
      };

      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Ad Copy Studio"),
          React.createElement("p", { className: "text-gray-400" }, "Generate high-converting ad copy for Meta and Google. (50 credits per use)"),
          React.createElement("div", { className: "relative" },
            React.createElement("input", {
              type: "text",
              className: "w-full bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "e.g., 'Indiainabag' e-commerce platform",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: !isStandardTier
            })
          ),
          React.createElement("button", {
            className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
            onClick: handleGenerate,
            disabled: loading || !isStandardTier
          }, loading ? 'Crafting Copy...' : 'Generate Ad Copy'),
          loading && React.createElement("div", { className: "text-center mt-4" }, "Crafting..."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          response && (
            React.createElement("div", { className: "bg-gray-900 rounded-xl p-6 border border-gray-700 mt-6" },
              React.createElement("p", { className: "text-gray-300 whitespace-pre-wrap" }, response)
            )
          ),
          !isStandardTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const SeoQuickAudit = ({ consumeCredits, isStandardTier, navigateTo }) => {
      const [prompt, setPrompt] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleGenerate = async () => {
        if (!isStandardTier) return;
        if (!(await consumeCredits(300))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setLoading(true);
        setError(null);
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        
        const aiResponse = await fetchAIResponse(`Perform a detailed SEO audit for the URL: "${prompt}". The response must include a 'Website Score' (out of 100) and then a professional report in markdown format with sections for 'On-Page SEO', 'Technical SEO', and 'Actionable Recommendations'. Include specific points for each section. The report should start with the date of the audit: ${date} at ${time}.`);
        
        setLoading(false);
        if (!aiResponse.startsWith("Failed to get a response")) {
            navigateTo('seo-audit-results', aiResponse);
        } else {
            setError(aiResponse);
        }
      };

      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "SEO Quick Audit"),
          React.createElement("p", { className: "text-gray-400" }, "Analyze on-page SEO and get actionable insights. (300 credits per audit)"),
          React.createElement("div", { className: "relative" },
            React.createElement("input", {
              type: "text",
              className: "w-full bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "e.g., https://www.digitalberries.co.in",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: !isStandardTier
            })
          ),
          React.createElement("button", {
            className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
            onClick: handleGenerate,
            disabled: loading || !isStandardTier
          }, loading ? 'Auditing...' : 'Run Audit'),
          loading && React.createElement("div", { className: "text-center mt-4" }, "Auditing..."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          !isStandardTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const WebsiteBuilder = ({ consumeCredits, isProTier }) => {
      const [prompt, setPrompt] = useState('');
      const [response, setResponse] = useState('');
      const [loading, setLoading] = useState(false);
      const [isPreview, setIsPreview] = useState(false);
      const [error, setError] = useState(null);
      const previewRef = useRef(null);

      const handleGenerate = async () => {
        if (!isProTier) return;
        if (!(await consumeCredits(500))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setLoading(true);
        setError(null);
        setResponse('');
        const aiResponse = await fetchAIResponse(`Create a professional, modern website for a business described as: "${prompt}". The output must be a single HTML file with all CSS in a <style> tag and all JavaScript in a <script> tag.`);
        setResponse(aiResponse);
        setLoading(false);
      };

      const handlePreview = () => {
        setIsPreview(true);
        setTimeout(() => {
          if (previewRef.current && previewRef.current.contentWindow) {
            const doc = previewRef.current.contentWindow.document;
            doc.open();
            doc.write(response);
            doc.close();
          }
        }, 100);
      };
      
      const renderContent = () => {
        if (isPreview) {
          return (
            React.createElement("div", { className: "bg-gray-900 rounded-xl p-4 border border-gray-700 mt-6 h-[500px]" },
              React.createElement("iframe", { ref: previewRef, className: "w-full h-full bg-white rounded-xl", title: "Website Preview" })
            )
          );
        }
        if (response) {
          return (
            React.createElement("div", { className: "bg-gray-900 rounded-xl p-6 border border-gray-700 mt-6" },
              React.createElement("p", { className: "text-gray-300 mb-4" }, "Here is the generated website code. You can copy and paste this into an HTML file to view it."),
              React.createElement("pre", { className: "bg-gray-700 p-4 rounded-xl text-sm overflow-x-auto text-[#00D692] font-mono whitespace-pre-wrap" },
                React.createElement("code", null, response)
              )
            )
          );
        }
        return null;
      };

      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Website Builder"),
          React.createElement("p", { className: "text-gray-400" }, "Generate a professional website plan and code based on your business needs. (500 credits per website)"),
          React.createElement("div", { className: "relative" },
            React.createElement("textarea", {
              className: "w-full min-h-[150px] bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "e.g., a modern e-commerce platform for handcrafted jewelry",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: !isProTier
            })
          ),
          React.createElement("div", { className: "flex space-x-4" },
            React.createElement("button", {
              className: "w-1/2 bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
              onClick: handleGenerate,
              disabled: loading || !isProTier
            }, loading ? 'Building Plan...' : 'Generate Website Code'),
            React.createElement("button", {
              className: "w-1/2 bg-gray-700 text-white font-bold py-3 rounded-full transition-all duration-300 hover:bg-gray-600 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
              onClick: handlePreview,
              disabled: !response || loading
            }, isPreview ? 'Back to Code' : 'Preview Website')
          ),
          loading && React.createElement("div", { className: "text-center mt-4" }, "Building..."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          renderContent(),
          !isProTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const ImageCaptionGenerator = ({ consumeCredits, isStandardTier }) => {
      const [prompt, setPrompt] = useState('');
      const [response, setResponse] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [imageFile, setImageFile] = useState(null);
      const [imagePreview, setImagePreview] = useState(null);

      const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          setImageFile(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

      const handleGenerate = async () => {
        if (!isStandardTier) return;
        if (!(await consumeCredits(50))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setLoading(true);
        setError(null);
        setResponse('');
        
        let aiPrompt;
        let imageBase64 = null;

        if (imageFile) {
          imageBase64 = imagePreview.split(',')[1];
          aiPrompt = `Analyze this image and generate a compelling social media caption and a list of 10 highly relevant hashtags. The caption should be engaging, and the hashtags should be optimized for organic reach.`;
        } else {
          aiPrompt = `Generate a compelling social media caption and a list of 10 highly relevant hashtags for the following topic: "${prompt}". The caption should be engaging, and the hashtags should be optimized for organic reach.`;
        }
        
        const aiResponse = await fetchAIResponse(aiPrompt, imageBase64);
        setResponse(aiResponse);
        setLoading(false);
      };

      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Image Caption & Hashtag Generator"),
          React.createElement("p", { className: "text-gray-400" }, "Generate creative captions and hashtags from text or by uploading an image. (50 credits per use)"),
          React.createElement("div", { className: "flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4" },
            React.createElement("div", { className: "flex-1" },
              React.createElement("label", { className: "block w-full text-center bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all cursor-pointer" },
                React.createElement("input", {
                  type: "file",
                  accept: "image/*",
                  onChange: handleImageUpload,
                  className: "hidden",
                  disabled: !isStandardTier
                }),
                imageFile ? 'Image Selected' : 'Upload Image'
              )
            ),
            React.createElement("div", { className: "flex-1" },
              React.createElement("input", {
                type: "text",
                className: "w-full bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
                placeholder: "Or describe an image...",
                value: prompt,
                onChange: (e) => setPrompt(e.target.value),
                disabled: !isStandardTier || imageFile
              })
            )
          ),
          imagePreview && (
            React.createElement("div", { className: "mt-4 flex justify-center" },
              React.createElement("img", { src: imagePreview, alt: "Image Preview", className: "rounded-xl max-h-60" })
            )
          ),
          React.createElement("button", {
            className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
            onClick: handleGenerate,
            disabled: loading || !isStandardTier || (!prompt && !imageFile)
          }, loading ? 'Generating...' : 'Generate Caption & Hashtags'),
          loading && React.createElement("div", { className: "text-center mt-4" }, "Generating..."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          response && (
            React.createElement("div", { className: "bg-gray-900 rounded-xl p-6 border border-gray-700 mt-6" },
              React.createElement("p", { className: "text-gray-300 whitespace-pre-wrap" }, response)
            )
          ),
          !isStandardTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const MetaAdsBuilder = ({ consumeCredits, isProTier }) => {
      const [prompt, setPrompt] = useState('');
      const [adPreview, setAdPreview] = useState(null);
      const [response, setResponse] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleGenerate = async () => {
        if (!isProTier) return;
        if (!(await consumeCredits(50))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setLoading(true);
        setError(null);
        setResponse('');
        setAdPreview(null);
        
        // Note: Due to API limitations, this tool simulates a complete Meta Ads campaign setup and ad creatives.
        const adImage = await fetchImage(`a professional ad for a business described as: "${prompt}". Focus on a clean, visually appealing design with a clear call to action.`);
        setAdPreview(adImage);

        const aiResponse = await fetchAIResponse(`Create a comprehensive Meta Ads campaign strategy for a business described as: "${prompt}". Include details on target audience, ad creative ideas, campaign objectives, and bidding strategy.`);
        setResponse(aiResponse);
        setLoading(false);
      };
      
      const renderAdPreview = () => {
        if (!adPreview) return null;
        return (
          React.createElement("div", { className: "bg-gray-900 rounded-xl p-6 border border-gray-700 mt-6 flex flex-col items-center" },
            React.createElement("h3", { className: "text-xl font-bold mb-4" }, "Ad Preview"),
            React.createElement("div", { className: "w-full max-w-sm rounded-xl overflow-hidden shadow-lg bg-gray-800" },
              React.createElement("img", { src: adPreview, alt: "Ad Creative Preview", className: "w-full h-auto object-cover" }),
              React.createElement("div", { className: "p-4" },
                React.createElement("h4", { className: "font-bold text-lg text-gray-200" }, "The Ultimate [Product]!"),
                React.createElement("p", { className: "text-gray-400 text-sm mt-1" }, "Get yours today and experience the difference."),
                React.createElement("button", { className: "mt-4 w-full bg-[#00D692] text-gray-900 font-bold py-2 rounded-full" }, "Shop Now")
              )
            )
          )
        );
      };

      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Meta Ads Builder"),
          React.createElement("p", { className: "text-gray-400" }, "Generate a full Meta Ads campaign strategy tailored to your business, with ad previews. (50 credits per use)"),
          React.createElement("div", { className: "relative" },
            React.createElement("textarea", {
              className: "w-full min-h-[150px] bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "e.g., a jewelry e-commerce business looking to increase online sales in the UK",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: !isProTier
            })
          ),
          React.createElement("button", {
            className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
            onClick: handleGenerate,
            disabled: loading || !isProTier
          }, loading ? 'Building Strategy...' : 'Generate Ads Strategy'),
          loading && React.createElement("div", { className: "text-center mt-4" }, "Building..."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          renderAdPreview(),
          response && (
            React.createElement("div", { className: "bg-gray-900 rounded-xl p-6 border border-gray-700 mt-6" },
              React.createElement("p", { className: "text-gray-300 whitespace-pre-wrap" }, response)
            )
          ),
          !isProTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const ContentPlanner = ({ consumeCredits, isStandardTier }) => {
      const [prompt, setPrompt] = useState('');
      const [contentPosts, setContentPosts] = useState([]);
      const [isGenerating, setIsGenerating] = useState(false);
      const [error, setError] = useState(null);
      const [numDays, setNumDays] = useState(5);

      const handleGenerate = async () => {
        if (!isStandardTier || !prompt) return;
        if (!(await consumeCredits(300))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setIsGenerating(true);
        setError(null);
        setContentPosts([]);

        const contentResponse = await fetchAIResponse(`Generate ${numDays} days worth of social media content ideas for the niche: "${prompt}". For each day, provide a high-quality caption, a list of 10 relevant hashtags, and a description for an image creative. The captions should be concise and professional. The hashtags should be high-volume and relevant. Format the output with clear headings for each post and bold the captions.`);
        
        // Simulate parsing the response into individual posts
        const posts = contentResponse.split('###').filter(p => p.trim());
        const generatedPosts = [];
        for (const p of posts) {
          if (p.trim()) {
            const imagePrompt = `professional social media post creative for "${prompt}" - ${p.substring(0, 50)}`;
            const imageUrls = await fetchImage(imagePrompt);
            generatedPosts.push({ text: p, imageUrl: imageUrls[0] });
          }
        }
        setContentPosts(generatedPosts);
        setIsGenerating(false);
      };
      
      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Content Planner"),
          React.createElement("p", { className: "text-gray-400" }, "Generate a full social media content plan with high-quality posts and creative ideas. (300 credits per plan)"),
          
          React.createElement("div", { className: "space-y-4" },
            React.createElement("label", { className: "block text-gray-300" }, "Content for how many days?"),
            React.createElement("select", { value: numDays, onChange: (e) => setNumDays(e.target.value), className: "w-full bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692]" },
              React.createElement("option", { value: "5" }, "5 Days"),
              React.createElement("option", { value: "10" }, "10 Days"),
              React.createElement("option", { value: "15" }, "15 Days"),
              React.createElement("option", { value: "30" }, "30 Days")
            ),
            React.createElement("textarea", {
              className: "w-full min-h-[150px] bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "e.g., A luxury travel agency targeting young adults, a vegan bakery in Mumbai, a fitness app. Please provide as much detail as possible for professional results.",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: !isStandardTier
            })
          ),

          React.createElement("button", {
            className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
            onClick: handleGenerate,
            disabled: isGenerating || !isStandardTier
          }, isGenerating ? 'Generating Plan...' : 'Generate Content Plan'),

          isGenerating && React.createElement("div", { className: "text-center mt-4" }, "Generating your posts... This may take a moment."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          
          contentPosts.length > 0 && (
            React.createElement("div", { className: "space-y-8 mt-8" },
              contentPosts.map((post, index) => (
                React.createElement("div", { key: index, className: "bg-gray-900 rounded-xl p-6 border border-gray-700" },
                  React.createElement("h4", { className: "text-xl font-bold mb-4", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Post ", index + 1),
                  React.createElement("div", { className: "flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center" },
                    post.imageUrl && (
                      React.createElement("div", { className: "flex-shrink-0" },
                        React.createElement("img", { src: post.imageUrl, alt: `Content creative for post ${index + 1}`, className: "w-full md:w-64 h-auto rounded-lg shadow-md" })
                      )
                    ),
                    React.createElement("div", { className: "flex-grow" },
                      React.createElement("p", { className: "text-gray-300 whitespace-pre-wrap" }, post.text)
                    )
                  )
                )
              ))
            )
          ),
          !isStandardTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const ImageGenerator = ({ consumeCredits, isProTier }) => {
      const [prompt, setPrompt] = useState('');
      const [images, setImages] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleGenerate = async () => {
        if (!isProTier || !prompt) return;
        if (!(await consumeCredits(50))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setLoading(true);
        setError(null);
        setImages([]);
        
        const generatedImages = await fetchImage(prompt);
        if (generatedImages) {
          setImages(generatedImages);
        } else {
          setError("Failed to generate images. Please try again with a different prompt.");
        }
        setLoading(false);
      };
      
      const handleDownload = (imageUrl, index) => {
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `digitalberries_image_${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Image Generator"),
          React.createElement("p", { className: "text-gray-400" }, "Generate high-quality, unique images from text prompts. (50 credits per image)"),
          React.createElement("div", { className: "relative" },
            React.createElement("textarea", {
              className: "w-full min-h-[150px] bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "Describe the image you want to generate...",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: !isProTier
            })
          ),
          React.createElement("button", {
            className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
            onClick: handleGenerate,
            disabled: loading || !isProTier
          }, loading ? 'Generating...' : 'Generate Images (50 Credits)'),

          loading && React.createElement("div", { className: "text-center mt-4" }, "Generating images... This may take a moment."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          
          images.length > 0 && (
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-8" },
              images.map((image, index) => (
                React.createElement("div", { key: index, className: "bg-gray-900 rounded-xl p-4 border border-gray-700" },
                  React.createElement("img", { src: image, alt: `Generated image ${index + 1}`, className: "w-full h-auto rounded-lg shadow-md" }),
                  React.createElement("button", { onClick: () => handleDownload(image, index), className: "mt-4 w-full bg-gray-700 text-white font-bold py-2 rounded-full hover:bg-gray-600" }, "Download Image ", index + 1)
                )
              ))
            )
          ),
          !isProTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const BrandTaglineGenerator = ({ consumeCredits, isStandardTier }) => {
      const [prompt, setPrompt] = useState('');
      const [response, setResponse] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleGenerate = async () => {
        if (!isStandardTier) return;
        if (!(await consumeCredits(50))) {
          setError("Not enough credits to perform this action. Please upgrade your plan.");
          return;
        }
        setLoading(true);
        setError(null);
        setResponse('');
        const aiResponse = await fetchAIResponse(`Generate 5 brand taglines for a business with the following description: "${prompt}". The taglines should be professional, memorable, and creative.`);
        setResponse(aiResponse);
        setLoading(false);
      };
      
      return (
        React.createElement("div", { className: "space-y-6 relative" },
          React.createElement("h2", { className: "text-3xl font-bold", style: { backgroundImage: 'linear-gradient(to right, #7B2CBF, #B5179E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, "Brand Tagline Generator"),
          React.createElement("p", { className: "text-gray-400" }, "Instantly generate creative and professional taglines for your brand. (50 credits per use)"),
          React.createElement("div", { className: "relative" },
            React.createElement("textarea", {
              className: "w-full min-h-[150px] bg-gray-700 text-white rounded-xl p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00D692] transition-all",
              placeholder: "Describe your brand, products, and target audience...",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              disabled: !isStandardTier
            })
          ),
          React.createElement("button", {
            className: "w-full bg-[#00D692] text-gray-900 font-bold py-3 rounded-full transition-all duration-300 hover:bg-[#00b377] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed",
            onClick: handleGenerate,
            disabled: loading || !isStandardTier
          }, loading ? 'Generating...' : 'Generate Taglines (50 Credits)'),
          loading && React.createElement("div", { className: "text-center mt-4" }, "Generating taglines..."),
          error && React.createElement("div", { className: "text-center mt-4 text-red-400" }, error),
          response && (
            React.createElement("div", { className: "bg-gray-900 rounded-xl p-6 border border-gray-700 mt-6" },
              React.createElement("p", { className: "text-gray-300 whitespace-pre-wrap" }, response)
            )
          ),
          !isStandardTier && React.createElement(LockedToolOverlay, null)
        )
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App, null));
  </script>
</body>
</html>

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Award, Zap, MapPin, Users, ChevronDown, X, Send, Calendar, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import './TestimonialsPage.css';

// Generate 220+ testimonials with authentic human language
const generateTestimonials = () => {
  const firstNames = [
    "Wanjiku", "Dennis", "Faith", "Brian", "Mercy", "Kevin", "Jane", "Samuel", "Lucy", "Peter",
    "Grace", "David", "Esther", "John", "Ruth", "James", "Mary", "Daniel", "Sarah", "Michael",
    "Elizabeth", "Joseph", "Anne", "Patrick", "Rebecca", "Francis", "Nancy", "Paul", "Joyce",
    "Simon", "Rose", "Thomas", "Catherine", "Mark", "Margaret", "Anthony", "Agnes", "Martin",
    "Beatrice", "Stephen", "Lydia", "George", "Eunice", "Kenneth", "Priscilla", "Charles",
    "Christine", "Robert", "Violet", "William", "Alice", "Richard", "Lillian", "Edward",
    "Hannah", "Andrew", "Gladys", "Benjamin", "Doris", "Joshua", "Martha", "Timothy",
    "Pauline", "Emmanuel", "Monica", "Isaac", "Florence", "Jacob", "Irene", "Moses",
    "Janet", "Aaron", "Susan", "Solomon", "Teresa", "Caleb", "Phyllis", "Elijah",
    "Jennifer", "Nathan", "Caroline", "Isaiah", "Josephine", "Collins", "Ivy", "Victor",
    "Winnie", "Allan", "Purity", "Edwin", "Stella", "Felix", "Diana", "Oscar", "Brenda"
  ];

  const lastNames = [
    "Kamau", "Otieno", "Njeri", "Mwangi", "Akinyi", "Omondi", "Wambui", "Kipchoge",
    "Nyambura", "Mutua", "Wanjiru", "Kimani", "Achieng", "Kariuki", "Adhiambo", "Githinji",
    "Onyango", "Muthoni", "Kiprotich", "Apiyo", "Ochieng", "Wairimu", "Koech", "Awino",
    "Kiplagat", "Wangari", "Cheruiyot", "Njoroge", "Kipkemboi", "Wamuyu", "Rotich",
    "Wangui", "Tanui", "Mutheu", "Bett", "Nyokabi", "Kirui", "Mumbua", "Lagat",
    "Nduta", "Kiptoo", "Nduku", "Kibet", "Makena", "Kigen", "Gathoni", "Sang",
    "Wafula", "Obonyo", "Muturi", "Kemboi", "Chepkwony", "Barasa", "Juma", "Njenga"
  ];

  const locations = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Naivasha",
    "Kitale", "Machakos", "Meru", "Nyeri", "Kericho", "Kakamega", "Kisii", "Embu",
    "Kilifi", "Homa Bay", "Bungoma", "Nanyuki", "Kajiado", "Kitui", "Ruiru", "Kiambu",
    "Athi River", "Migori", "Busia", "Narok", "Ngong", "Limuru", "Juja", "Rongai"
  ];

  const badges = [
    { name: "Starter", color: "from-gray-400 to-gray-600", textColor: "text-gray-300", borderColor: "border-gray-500/30" },
    { name: "Pro", color: "from-blue-500 to-indigo-600", textColor: "text-blue-300", borderColor: "border-blue-500/30" },
    { name: "VIP Elite", color: "from-yellow-400 to-orange-500", textColor: "text-yellow-300", borderColor: "border-yellow-500/30" }
  ];

  const comments = [
    "Bro, I've been placing bets for years but this site is different. The odds are fair and I actually win! Last week alone nilipata three correct scores. This is not like those other sites that steal your money.",
    "Honestly guys, if you're serious about betting just join here. I won on a multi-bet yesterday - 5 games all came through! The predictions community here shares real tips, not fake vibes.",
    "I'm not even joking, this platform changed my betting game completely. Used to lose every weekend but now I'm actually making profit. Their live betting feature is smooth AF!",
    "So my cousin told me about this site after he won big on Chelsea vs Arsenal. I joined last month and I've already cashed out twice. The withdrawal process is super fast - money hits M-Pesa within minutes!",
    "Real talk - been betting on different platforms for 3 years. This one tops them all. Won a jackpot bonus last week and they paid out immediately. No stories, no delays. Just smooth transactions.",
    "Yaani these odds are actually good! Not like those other sites wanaeka odds 1.02 for Man City to win. Here the value is real. Placed 500 bob on an underdog, cashed out 8K. Poa sana!",
    "I was skeptical at first because I've been scammed by betting sites before. But this one is legit! Their customer support responds fast and payouts are instant. Already recommended to my boys.",
    "Guys, the live odds here are insane! I caught Liverpool at 3.5 when they were losing 1-0 and they came back to win 2-1. Best bet I've ever placed. This site knows what's up!",
    "Been using this for 2 months now and my win rate has gone up crazy. The statistics they provide for each match help a lot. Did proper research and won 12K last weekend on accumulators!",
    "Not gonna lie, I lost some bets when I started but that's normal. The key is their VIP tips are actually good. Since I upgraded to Pro, I've been winning more than losing. Worth every shilling!",
    "Bana, this platform respects punters. Placed a bet on Gor Mahia and they actually gave me the win when the match was abandoned at 80th minute with them leading. Other sites would have cancelled it!",
    "My workmates introduced me to this and I thought it was another scam. But after my first cashout, I was sold! The minimum stake is fair and you can bet on everything - EPL, NBA, even esports!",
    "I love how transparent everything is. You can see other people's bets and learn from them. Followed someone's multi-bet last week and boom! 15K profit. Community here is solid!",
    "Real betting platform this one! Won 25K on a crazy accumulator - 8 teams all won. Other sites I've used would have frozen my account. Here they paid out instantly. Respect!",
    "The in-play betting feature saved my life. Was losing on a bet but cashed out early when I saw the game wasn't going my way. Lost small instead of big. Smart features on this site!",
    "Placed my first bet here on Sunday - Man United to win and Salah to score. Both came through and got my payout in 5 minutes. Why did I waste time on those other platforms? This is the real deal!",
    "Guys if you bet regularly, just upgrade to VIP Elite. The exclusive tips alone pay for themselves. I won 40K last month following their premium predictions. No cap!",
    "I used to bet blindly but this site taught me strategy. Their match analysis is detailed and helped me understand betting better. Now I win more often than I lose. Game changer!",
    "Been gambling online since 2019 and this is hands down the best platform in Kenya. Quick payouts, good odds, and actual customer support. Recommended 100%!",
    "Won my first jackpot here last week - 7/13 correct and got the bonus payout! Other sites don't even give you anything unless you get all correct. This one rewards even close wins!",
    "The mobile app is smooth! Placed a live bet during a matatu ride and won 3K. Money was in my M-Pesa before I reached town. Technology ya kisasa!",
    "I'm telling you, this site changed my weekends. Used to stress about losses but now I bet smart using their stats. Won 18K this month alone. Join ukam bro!",
    "Real review - this is not a scam. I've withdrawn over 50K total since joining. They pay every single time without stories. Trust is everything in betting and these guys deliver.",
    "My betting group moved here from another platform and we're never going back. Better odds, faster payouts, and the multi-bet options are fire. We won 60K combined last weekend!",
    "First time betting on a platform where they actually explain how odds work. For beginners like me, this helped a lot. Already won small amounts consistently. Building my bankroll slowly!",
    "Bana the live streaming feature is clutch! Watched the match live while betting and adjusted my strategy. Won by cashing out at the right time. This is next level!",
    "I compared odds across 5 different sites before placing my bet. This one had the best value. Won 9K on a simple double bet. Always check your odds guys!",
    "Customer support here is A1. Had an issue with my account and they sorted it in like 10 minutes. Then went ahead and won 7K that same day. Good energy!",
    "The accumulator boost feature is crazy! My 6-team multi would have paid 12K but with the boost I got 15K. Extra 3K for free basically. Smart business!",
    "Been losing on other platforms for months. Joined here last week and already in profit! The difference is the odds are not rigged. Fair game, fair pay!",
    "Won 22K on a correct score bet - nobody saw that 3-2 coming! The odds were 45.0 and I put just 500 bob. Best decision ever. This site pays!",
    "I only bet on basketball and this platform has the best NBA odds I've seen. Won on a Lakers spread last night. Cashed out in the morning. Smooth operator!",
    "Real talk, I was about to quit betting until I found this site. The tips community saved me. Following someone's predictions and I'm up 10K this week alone!",
    "The cashout feature is a lifesaver. Was going to lose 5K on a bet but cashed out early and only lost 1K. Other sites don't give you that option. This one does!",
    "My first withdrawal took 2 minutes to hit my M-Pesa! I was shocked. Been using other sites where it takes 2 hours. This is efficiency at its best!",
    "Yaani you can bet on everything here - football, tennis, UFC, even virtual games. Won 4K on a virtual match while waiting for the real EPL games. Variety is key!",
    "The odds boost on selected matches is genius. Saw Man City boosted from 1.5 to 1.8, put 2K and won 3.6K instead of 3K. Free money basically!",
    "I'm a Gor Mahia fan and I only bet on KPL matches. This site actually has good coverage of Kenyan football unlike others. Won 6K betting on local teams!",
    "Started with the Starter plan just to test. Won 5K in the first week and upgraded to Pro immediately. The premium tips are worth it if you're serious about winning.",
    "Been tracking my bets and I'm up 35K in 2 months! The key is using their stats and not betting emotionally. This platform gives you all the tools to win.",
    "My boy won 100K on a crazy accumulator and they paid out same day! I've seen the screenshot. This is not those scam sites. This is the real thing!",
    "The responsible gambling features are good too. You can set limits on your account so you don't go overboard. Lost control on other sites but here I'm betting smart.",
    "Won 8K on Champions League last Wednesday! The European football odds here are better than any other Kenyan site. Finally a platform that values punters!",
    "I only bet on weekends and this site makes it worth it. Won 12K last Saturday on a 4-team multi. All favorites came through. Sometimes simple bets are the best!",
    "The referral bonus is real! Invited 3 friends, got my bonus, and used it to place a winning bet. Made 5K from a free bet. This site treats members well!",
    "Real member here - don't sleep on the VIP Elite plan. The insider tips are accurate. Won 30K last month just following their premium predictions. ROI is crazy!",
    "I'm not a big bettor but I put small amounts regularly. This site respects even small bets - won 2K from a 200 bob stake. They don't discriminate!",
    "The fact that you can bet from as low as 50 bob is perfect for beginners. I started small, learned the ropes, now I'm placing bigger bets and winning!",
    "Won on a halftime/fulltime bet yesterday - Arsenal winning at HT and FT. Odds were 3.2 and I put 3K. Woke up to 9.6K in my account. Smooth like butter!",
    "This platform actually has the best over/under odds. I specialize in goals betting and I've won 8 out of my last 10 bets. The research tools help a lot!",
    "My wife thought I was wasting money on betting until I showed her my withdrawals. Made 20K this month and she's now asking me to teach her. This site changed my life!"
  ];

  const timeOptions = [
    "5 minutes ago", "15 minutes ago", "30 minutes ago", "1 hour ago", "2 hours ago",
    "3 hours ago", "5 hours ago", "8 hours ago", "12 hours ago", "18 hours ago",
    "1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago",
    "1 week ago", "2 weeks ago", "3 weeks ago"
  ];

  const emails = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];
  const phonePrefix = ["+254 7", "+254 1"];

  const testimonials = [];

  for (let i = 0; i < 220; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const badge = badges[Math.floor(Math.random() * badges.length)];
    const comment = comments[Math.floor(Math.random() * comments.length)];
    const time = timeOptions[Math.floor(Math.random() * timeOptions.length)];
    const status = Math.random() > 0.35 ? "online" : "offline";

    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emails[Math.floor(Math.random() * emails.length)]}`;
    const phone = `${phonePrefix[Math.floor(Math.random() * phonePrefix.length)]}${Math.floor(10000000 + Math.random() * 90000000)}`;
    const memberSince = `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'][Math.floor(Math.random() * 11)]} ${2024 - Math.floor(Math.random() * 2)}`;

    testimonials.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      location: location,
      time: time,
      status: status,
      avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`,
      comment: comment,
      verified: Math.random() > 0.08,
      badge: badge,
      email: email,
      phone: phone,
      memberSince: memberSince,
      color: `from-${['purple', 'blue', 'green', 'pink', 'indigo', 'cyan', 'teal', 'orange', 'rose', 'violet'][Math.floor(Math.random() * 10)]}-500 to-${['purple', 'blue', 'green', 'pink', 'indigo', 'cyan', 'teal', 'orange', 'rose', 'violet'][Math.floor(Math.random() * 10)]}-600`
    });
  }

  return testimonials;
};

// Function to mask email address
const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  if (username.length <= 3) {
    return `${username.charAt(0)}***@${domain}`;
  }
  const visibleChars = 2;
  const masked = username.substring(0, visibleChars) + '***' + username.substring(username.length - 1);
  return `${masked}@${domain}`;
};

// Function to mask phone number
const maskPhone = (phone) => {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length >= 10) {
    return `${cleaned.substring(0, 6)}** *** ${cleaned.substring(cleaned.length - 3)}`;
  }
  return phone;
};

const TestimonialsPage = () => {
  const [testimonials] = useState(generateTestimonials());
  const [visibleCards, setVisibleCards] = useState([]);
  const [activeSubscribers, setActiveSubscribers] = useState(
    Math.floor(Math.random() * (900 - 100 + 1)) + 100
  );
  const [displayCount, setDisplayCount] = useState(15);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [commentText, setCommentText] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [revealedContacts, setRevealedContacts] = useState(new Set());

  useEffect(() => {
    for (let i = 0; i < Math.min(displayCount, testimonials.length); i++) {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, i]);
      }, i * 40);
    }
  }, [displayCount, testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCount = Math.floor(Math.random() * (900 - 100 + 1)) + 100;
      setActiveSubscribers(newCount);
    }, 300000);

    const microInterval = setInterval(() => {
      setActiveSubscribers(prev => {
        const change = Math.floor(Math.random() * 11) - 5;
        const newVal = prev + change;
        return Math.max(100, Math.min(900, newVal));
      });
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(microInterval);
    };
  }, []);

  const loadMore = () => {
    const newCount = Math.min(displayCount + 15, testimonials.length);
    setDisplayCount(newCount);

    for (let i = displayCount; i < newCount; i++) {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, i]);
      }, (i - displayCount) * 40);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      setShowSubscriptionModal(true);
    }
  };

  const handleProfileClick = (testimonial) => {
    setSelectedProfile(testimonial);
  };

  const toggleContactReveal = (id, field) => {
    const key = `${id}-${field}`;
    setRevealedContacts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const isContactRevealed = (id, field) => {
    return revealedContacts.has(`${id}-${field}`);
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="testimonials-page">
      {/* Animated background */}
      <div className="bg-animation">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      <div className="container">
        {/* Header Section */}
        <div className="header-section">
          <div className="live-badge">
            <Zap className="icon-zap" />
            <span className="badge-text">Live Community</span>
            <div className="pulse-dots">
              <div className="pulse-dot pulse-dot-animated"></div>
              <div className="pulse-dot"></div>
            </div>
          </div>

          <h1 className="main-title">
            Member Success Stories
          </h1>
          
          <p className="main-subtitle">
            Join our thriving community of satisfied members across Kenya. See what our members are saying about their experience!
          </p>

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-value">
                <Users className="stat-icon" />
                10K+
              </div>
              <div className="stat-label">Total Subscribers</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">
                {activeSubscribers}
                <div className="online-indicator"></div>
              </div>
              <div className="stat-label">Active Subscribers</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{testimonials.length}+</div>
              <div className="stat-label">Success Stories</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.slice(0, displayCount).map((testimonial, index) => {
            const isExpanded = expandedCards.has(testimonial.id);
            const shouldTruncate = testimonial.comment.length > 150;
            
            return (
              <div
                key={testimonial.id}
                className={`testimonial-card ${visibleCards.includes(index) ? 'visible' : ''}`}
              >
                <div className="card-inner">
                  {/* Header */}
                  <div className="card-header">
                    <div 
                      className="profile-section"
                      onClick={() => handleProfileClick(testimonial)}
                    >
                      <div className={`avatar bg-gradient-${testimonial.color}`}>
                        {testimonial.avatar}
                      </div>
                      <div className="profile-info">
                        <div className="name-row">
                          <h3 className="profile-name">{testimonial.name}</h3>
                          {testimonial.verified && (
                            <CheckCircle className="verified-icon" />
                          )}
                        </div>
                        <div className="location-row">
                          <MapPin className="location-icon" />
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`status-badge ${testimonial.status}`}>
                      <div className="status-dot"></div>
                      {testimonial.status}
                    </div>
                  </div>

                  {/* Badge */}
                  <div className={`member-badge bg-gradient-${testimonial.badge.color} border-${testimonial.badge.borderColor}`}>
                    <Award className="badge-icon" />
                    <span className="badge-name">{testimonial.badge.name}</span>
                  </div>

                  {/* Comment */}
                  <div className="comment-section">
                    <p className="comment-text">
                      "{isExpanded || !shouldTruncate ? testimonial.comment : truncateText(testimonial.comment)}"
                    </p>
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpanded(testimonial.id)}
                        className="read-more-btn"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                        <ChevronDown className={`chevron-icon ${isExpanded ? 'rotated' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="card-footer">
                    <div className="time-stamp">
                      <Clock className="clock-icon" />
                      {testimonial.time}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comment Section */}
        <div className="comment-form-section">
          <div className="comment-form-container">
            <h2 className="form-title">
              <Send className="send-icon" />
              Share Your Thoughts
            </h2>
            
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here..."
                className="comment-textarea"
              />
              
              <button
                type="submit"
                className="submit-btn"
              >
                <Send className="btn-icon" />
                Post Comment
              </button>
            </form>
          </div>
        </div>

        {/* Load More Button */}
        {displayCount < testimonials.length && (
          <div className="load-more-section">
            <button
              onClick={loadMore}
              className="load-more-btn"
            >
              Load More Stories
              <ChevronDown className="bounce-icon" />
            </button>
            <p className="load-more-text">
              Showing <span className="highlight">{displayCount}</span> of <span className="highlight">{testimonials.length}</span> success stories
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-container">
            <div className="cta-overlay"></div>
            <div className="cta-content">
              <h2 className="cta-title">Ready to Join Our Community?</h2>
              <p className="cta-text">
                Be part of our growing community of {testimonials.length}+ satisfied members across Kenya. Your success story starts here!
              </p>
              <button className="cta-btn">
                Join Now 
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">✓ 100% Verified Members</div>
          <div className="trust-item">✓ Active Community</div>
          <div className="trust-item">✓ 24/7 Support</div>
          <div className="trust-item">✓ Secure Platform</div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="modal-overlay">
          <div className="modal-content subscription-modal">
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="modal-close"
            >
              <X className="close-icon" />
            </button>

            <div className="modal-header">
              <div className="modal-icon">
                <Award className="award-icon" />
              </div>
              <h3 className="modal-title">Subscription Required</h3>
              <p className="modal-subtitle">
                You need to be a subscriber to comment and interact with our community.
              </p>
            </div>

            <div className="plans-list">
              <div className="plan-card starter-plan">
                <div className="plan-header">
                  <span className="plan-name">Starter Plan</span>
                  <span className="plan-tag">Basic Access</span>
                </div>
                <p className="plan-description">Get started with essential features</p>
              </div>

              <div className="plan-card pro-plan">
                <div className="plan-header">
                  <span className="plan-name">Pro Plan</span>
                  <span className="plan-tag popular">Popular</span>
                </div>
                <p className="plan-description">Advanced features & priority support</p>
              </div>

              <div className="plan-card vip-plan">
                <div className="plan-header">
                  <span className="plan-name">VIP Elite Plan</span>
                  <span className="plan-tag premium">Premium</span>
                </div>
                <p className="plan-description">Exclusive benefits & full access</p>
              </div>
            </div>

            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="modal-action-btn"
            >
              Choose Your Plan
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="modal-overlay">
          <div className="modal-content profile-modal">
            <button
              onClick={() => setSelectedProfile(null)}
              className="modal-close"
            >
              <X className="close-icon" />
            </button>

            <div className="profile-modal-header">
              <div className={`profile-avatar bg-gradient-${selectedProfile.color}`}>
                {selectedProfile.avatar}
              </div>
              
              <div className="profile-name-row">
                <h3 className="profile-modal-name">{selectedProfile.name}</h3>
                {selectedProfile.verified && (
                  <CheckCircle className="verified-badge" />
                )}
              </div>
              
              <div className={`profile-badge bg-gradient-${selectedProfile.badge.color} border-${selectedProfile.badge.borderColor}`}>
                <Award className="profile-badge-icon" />
                <span className="profile-badge-name">{selectedProfile.badge.name}</span>
              </div>

              <div className={`profile-status ${selectedProfile.status}`}>
                <div className="profile-status-dot"></div>
                {selectedProfile.status}
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-card">
                <div className="detail-header">
                  <MapPin className="detail-icon" />
                  <span className="detail-label">Location</span>
                </div>
                <p className="detail-value">{selectedProfile.location}, Kenya</p>
              </div>

              <div className="detail-card">
                <div className="detail-header-row">
                  <div className="detail-header">
                    <Mail className="detail-icon" />
                    <span className="detail-label">Email</span>
                  </div>
                  <button
                    onClick={() => toggleContactReveal(selectedProfile.id, 'email')}
                    className="reveal-btn"
                  >
                    {isContactRevealed(selectedProfile.id, 'email') ? (
                      <EyeOff className="eye-icon" />
                    ) : (
                      <Eye className="eye-icon" />
                    )}
                  </button>
                </div>
                <p className="detail-value masked">
                  {isContactRevealed(selectedProfile.id, 'email') 
                    ? selectedProfile.email 
                    : maskEmail(selectedProfile.email)}
                </p>
              </div>

              <div className="detail-card">
                <div className="detail-header-row">
                  <div className="detail-header">
                    <Phone className="detail-icon" />
                    <span className="detail-label">Phone</span>
                  </div>
                  <button
                    onClick={() => toggleContactReveal(selectedProfile.id, 'phone')}
                    className="reveal-btn"
                  >
                    {isContactRevealed(selectedProfile.id, 'phone') ? (
                      <EyeOff className="eye-icon" />
                    ) : (
                      <Eye className="eye-icon" />
                    )}
                  </button>
                </div>
                <p className="detail-value masked">
                  {isContactRevealed(selectedProfile.id, 'phone') 
                    ? selectedProfile.phone 
                    : maskPhone(selectedProfile.phone)}
                </p>
              </div>

              <div className="detail-card">
                <div className="detail-header">
                  <Calendar className="detail-icon" />
                  <span className="detail-label">Member Since</span>
                </div>
                <p className="detail-value">{selectedProfile.memberSince}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedProfile(null)}
              className="modal-action-btn"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;

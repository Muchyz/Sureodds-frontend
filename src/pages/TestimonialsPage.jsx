import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, CheckCircle, Award, Zap, MapPin, Users, ChevronDown, X, Send, 
  Calendar, Mail, Phone, Star, TrendingUp, Shield, 
  Heart, MessageCircle, Filter, Search
} from 'lucide-react';
import './TestimonialsPage.css';

// Kenyan phone number prefixes based on real patterns
const phonePrefix = [
  '+254700', '+254701', '+254702', '+254703', '+254704', '+254705', '+254706', '+254707', '+254708', '+254709',
  '+254710', '+254711', '+254712', '+254713', '+254714', '+254715', '+254716', '+254717', '+254718', '+254719',
  '+254720', '+254721', '+254722', '+254723', '+254724', '+254725', '+254726', '+254727', '+254728', '+254729',
  '+254790', '+254791', '+254792', '+254793', '+254794', '+254795', '+254796', '+254797', '+254798', '+254799',
  '+254100', '+254101', '+254102', '+254103', '+254104', '+254105', '+254106', '+254107', '+254108', '+254109',
  '+254110', '+254111', '+254112', '+254113', '+254114', '+254115', '+254116', '+254117', '+254118', '+254119'
];

// Generate 220+ testimonials with authentic human language
const generateTestimonials = () => {
  // Male names pool (90%)
  const maleFirstNames = [
    "Dennis", "Brian", "Kevin", "Samuel", "Peter", "David", "John", "James", "Daniel", "Michael",
    "Joseph", "Patrick", "Francis", "Paul", "Simon", "Thomas", "Mark", "Anthony", "Martin", "Stephen",
    "George", "Kenneth", "Charles", "Robert", "William", "Richard", "Edward", "Andrew", "Benjamin", "Joshua",
    "Timothy", "Emmanuel", "Isaac", "Jacob", "Moses", "Aaron", "Solomon", "Caleb", "Elijah", "Nathan",
    "Isaiah", "Collins", "Victor", "Allan", "Edwin", "Felix", "Oscar", "Vincent", "Eric", "Ian",
    "Alex", "Chris", "Tony", "Steve", "Philip", "Henry", "Fred", "Leonard", "Gerald", "Ronald",
    "Brian", "Dennis", "Kevin", "Samuel", "Peter", "David", "John", "James", "Daniel", "Michael",
    "Joseph", "Patrick", "Francis", "Paul", "Kelvin", "Emmanuel", "Isaac", "Jacob", "Moses", "Aaron",
    "Clinton", "Austin", "Derrick", "Elvis", "Gilbert", "Hillary", "Ian", "Julius", "Ken", "Lewis",
    "Maxwell", "Nelson", "Oliver", "Pascal", "Quincy", "Raymond", "Shadrack", "Trevor", "Urbanus", "Vitalis"
  ];

  const maleLastNames = [
    "Kamau", "Otieno", "Mwangi", "Omondi", "Kipchoge", "Mutua", "Kimani", "Kariuki", "Githinji",
    "Onyango", "Kiprotich", "Ochieng", "Koech", "Kiplagat", "Cheruiyot", "Njoroge", "Kipkemboi", "Rotich",
    "Tanui", "Bett", "Kirui", "Lagat", "Kiptoo", "Kibet", "Kigen", "Sang", "Wafula", "Obonyo",
    "Muturi", "Kemboi", "Barasa", "Juma", "Njenga", "Mburu", "Chege", "Waithaka", "Githiga", "Muchai",
    "Karanja", "Maina", "Ndungu", "Thuo", "Waigwa", "Kabiru", "Nganga", "Gathogo", "Kinyanjui", "Miano",
    "Gachanja", "Ndegwa", "Gichuki", "Mugo", "Wainaina"
  ];

  // Female names pool (10%)
  const femaleFirstNames = [
    "Faith", "Mercy", "Jane", "Lucy", "Grace", "Esther", "Ruth", "Mary", "Sarah", "Anne",
    "Elizabeth", "Rebecca", "Nancy", "Joyce", "Rose", "Catherine", "Margaret", "Agnes", "Beatrice",
    "Lydia", "Eunice", "Priscilla", "Christine", "Violet", "Alice", "Lillian", "Hannah", "Gladys"
  ];

  const femaleLastNames = [
    "Njeri", "Akinyi", "Wambui", "Nyambura", "Wanjiru", "Achieng", "Adhiambo", "Muthoni",
    "Apiyo", "Wairimu", "Awino", "Wangari", "Wamuyu", "Wangui", "Mutheu", "Nyokabi",
    "Mumbua", "Nduta", "Nduku", "Makena", "Gathoni", "Chepkwony", "Moraa", "Kerubo"
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
    "Honestly, since I joined this site, everything has been so smooth and easy to follow. The picks are very reliable, and I feel confident placing my bets knowing the team behind this does real research. I've already seen a noticeable improvement in my results compared to other places I've tried before.",
    "I'm really glad I decided to subscribe here. The experts provide detailed tips and explanations, so even when I'm new to a type of bet, I feel guided. Last weekend I followed a multi-bet recommendation and it all came through, which was a great feeling!",
    "This site has completely changed how I approach betting. Before, I was just guessing, but now I have solid data and clear picks to follow. The updates are consistent, and I never feel left wondering what to do next.",
    "From the first day, I could tell the team knows exactly what they're doing. Every selection is carefully thought out, and the way they communicate tips makes it easy to understand. I feel much more confident now, and my wins are starting to reflect that.",
    "I didn't expect much at first, but the results have surprised me in a really good way. The live updates and accurate predictions make the experience stress-free, and I've actually started looking forward to the weekend games now.",
    "The games are always well-selected and presented clearly. I like how the team explains why they think a particular pick will win, which helps me understand the strategy. It's refreshing compared to other sites that just throw numbers at you.",
    "I like how simple it is to use this service. I just check the picks, follow them, and enjoy the process. Even when I place multiple bets, the system is easy to navigate, and I never feel overwhelmed.",
    "Since subscribing, things have been stress-free and smooth. The team communicates updates quickly, and the recommendations are easy to follow. I've already recommended this site to a few friends who are now seeing good results too.",
    "This is honestly the kind of community I've been searching for. The tips are trustworthy, and the advice is practical. I feel like I finally found a service that actually cares about helping members win.",
    "I feel very comfortable trusting the picks shared here. The team's explanations are clear, and the results speak for themselves. I've tried other apps, but nothing compares to the reliability I get here.",
    "The consistency here is what really stands out to me. Every week, the predictions feel well-researched, and I can plan my bets confidently. It's a big relief compared to jumping from one random site to another.",
    "I've tried other sites before, but this one feels completely different. The support is quick, the tips are accurate, and the whole experience feels professional. I finally feel like I can trust the advice I'm following.",
    "Everything about this service feels professional and well-managed. The team clearly puts effort into analyzing games and providing insight, which shows in the results. My betting strategy has improved significantly since joining.",
    "I joined with small expectations, but now I'm fully convinced this is worth it. The explanations make sense, the recommendations are clear, and I actually feel more in control of my bets. It's been a game-changer for me.",
    "The experience here has been very encouraging. Even when a pick doesn't come through, the reasoning and advice help me understand what went wrong and how to adjust. That level of transparency is rare.",
    "I like how the games are carefully chosen and presented. The information is easy to read, and I can quickly decide which bets to place. It saves a lot of time and reduces stress compared to other sites.",
    "This team really understands what users need. They provide options for beginners and advanced members alike, and the explanations are always clear. I feel supported and informed every step of the way.",
    "I'm happy I gave this service a chance. The results are consistent, the support is helpful, and I've actually started enjoying betting instead of stressing about losses. This has been a positive experience overall.",
    "The smooth experience here is something I really appreciate. From logging in to placing bets to receiving updates, everything works efficiently. It's rare to find a service that runs this well.",
    "I've had nothing but a good experience since I joined. The recommendations are trustworthy, the odds are fair, and the whole process feels safe. I'm already planning to continue using this for a long time.",
    "The picks here are always clear and easy to follow. I never feel confused or unsure about what to do next, and that makes a huge difference in my confidence when betting.",
    "I don't stress anymore; I just follow the advice calmly and enjoy the process. The team's explanations give me confidence, and I've noticed a big improvement in my results since joining.",
    "This service has made things easier for me. I can plan my bets with confidence, follow the recommendations, and actually see consistent results. It's a relief compared to guessing or using random tips.",
    "I'm really enjoying my time as a member here. The updates are frequent but not overwhelming, and the explanations are clear. I feel informed and in control of my betting choices.",
    "Everything works in a very simple and reliable way. The recommendations are easy to understand, the process is straightforward, and I never feel left in the dark.",
    "The way this site operates shows real professionalism. The team communicates well, the picks are backed by research, and I feel confident that I'm getting accurate information.",
    "I like the confidence this service gives me. I no longer second-guess my bets because I know the picks are carefully analyzed. It's a huge improvement over previous sites I've tried.",
    "It has been a very comfortable experience from the start. The interface is easy to use, the tips are clear, and the results are consistent. I've finally found a service I can rely on.",
    "I'm impressed with how steady everything has been. Week after week, the tips remain reliable and consistent. That consistency makes planning my bets so much easier.",
    "This system has honestly met my expectations. The tips are accurate, the updates are clear, and I feel more confident in my betting strategy than ever before.",
  ];

  const timeOptions = [
    "5 minutes ago", "15 minutes ago", "30 minutes ago", "1 hour ago", "2 hours ago",
    "3 hours ago", "5 hours ago", "8 hours ago", "12 hours ago", "18 hours ago",
    "1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago",
    "1 week ago", "2 weeks ago", "3 weeks ago"
  ];

  const testimonials = [];

  for (let i = 0; i < 220; i++) {
    // 90% chance of male name, 10% chance of female name
    const isMale = Math.random() < 0.9;
    
    let firstName, lastName;
    if (isMale) {
      // Male name combination
      firstName = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
      lastName = maleLastNames[Math.floor(Math.random() * maleLastNames.length)];
    } else {
      // Female name combination
      firstName = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
      lastName = femaleLastNames[Math.floor(Math.random() * femaleLastNames.length)];
    }
    
    const location = locations[Math.floor(Math.random() * locations.length)];
    const badge = badges[Math.floor(Math.random() * badges.length)];
    const comment = comments[Math.floor(Math.random() * comments.length)];
    const time = timeOptions[Math.floor(Math.random() * timeOptions.length)];
    
    // More realistic online/offline distribution - 60-70% online
    const status = Math.random() > 0.35 ? "online" : "offline";
    const rating = 4 + Math.floor(Math.random() * 2); // 4 or 5 stars
    const likes = Math.floor(Math.random() * (1276 - 118 + 1)) + 118; // Range: 118 to 1276

    // All emails are Gmail
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
    // Generate proper Kenyan phone number: +254XXXXXXXXX (12 digits total)
    // Format: +254 + 3-digit prefix (already in phonePrefix) + 6 random digits
    const prefix = phonePrefix[Math.floor(Math.random() * phonePrefix.length)];
    const remainingDigits = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
    const phone = `${prefix}${remainingDigits}`;
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
      rating: rating,
      likes: likes,
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

// Function to mask phone number - Kenyan format
const maskPhone = (phone) => {
  // Kenyan format: +254XXXXXXXXX (12 digits total)
  // Display as: +254705***449 (show first 6 chars of prefix, mask middle, show last 3)
  if (phone.length >= 12) {
    return `${phone.substring(0, 7)}***${phone.substring(phone.length - 3)}`;
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
  const [likedCards, setLikedCards] = useState(new Set());
  const [commentText, setCommentText] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filterBadge, setFilterBadge] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef(null);

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
    const newCount = Math.min(displayCount + 15, filteredTestimonials.length);
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

  const toggleLike = (id) => {
    setLikedCards(prev => {
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

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesBadge = filterBadge === 'all' || testimonial.badge.name === filterBadge;
    const matchesSearch = testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBadge && matchesSearch;
  });

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

          {/* Enhanced Stats Bar */}
          <div className="stats-bar">
            <div className="stat-card stat-card-pulse">
              <div className="stat-icon-wrapper">
                <Users className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">10K+</div>
                <div className="stat-label">Total Members</div>
              </div>
            </div>
            
            <div className="stat-card stat-card-pulse">
              <div className="stat-icon-wrapper">
                <TrendingUp className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {activeSubscribers}
                  <div className="online-indicator"></div>
                </div>
                <div className="stat-label">Active Now</div>
              </div>
            </div>
            
            <div className="stat-card stat-card-pulse">
              <div className="stat-icon-wrapper">
                <Star className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">4.9/5</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="filter-section">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, location, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear"
              >
                <X className="clear-icon" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle"
          >
            <Filter className="filter-icon" />
            Filters
            <ChevronDown className={`chevron-icon ${showFilters ? 'rotated' : ''}`} />
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="filter-options">
            <button
              onClick={() => setFilterBadge('all')}
              className={`filter-btn ${filterBadge === 'all' ? 'active' : ''}`}
            >
              All Members
            </button>
            <button
              onClick={() => setFilterBadge('Starter')}
              className={`filter-btn ${filterBadge === 'Starter' ? 'active' : ''}`}
            >
              Starter
            </button>
            <button
              onClick={() => setFilterBadge('Pro')}
              className={`filter-btn ${filterBadge === 'Pro' ? 'active' : ''}`}
            >
              Pro
            </button>
            <button
              onClick={() => setFilterBadge('VIP Elite')}
              className={`filter-btn ${filterBadge === 'VIP Elite' ? 'active' : ''}`}
            >
              VIP Elite
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="results-info">
          <p className="results-text">
            Showing <span className="highlight">{Math.min(displayCount, filteredTestimonials.length)}</span> of{' '}
            <span className="highlight">{filteredTestimonials.length}</span> testimonials
            {(searchQuery || filterBadge !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterBadge('all');
                }}
                className="clear-filters"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {filteredTestimonials.slice(0, displayCount).map((testimonial, index) => {
            const isExpanded = expandedCards.has(testimonial.id);
            const isLiked = likedCards.has(testimonial.id);
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
                        <div className="avatar-ring"></div>
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

                  {/* Badge and Rating */}
                  <div className="badge-rating-row">
                    <div className={`member-badge bg-gradient-${testimonial.badge.color} border-${testimonial.badge.borderColor}`}>
                      <Award className="badge-icon" />
                      <span className="badge-name">{testimonial.badge.name}</span>
                    </div>

                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`star-icon ${i < testimonial.rating ? 'filled' : ''}`}
                        />
                      ))}
                    </div>
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

                    <div className="card-actions">
                      <button
                        onClick={() => toggleLike(testimonial.id)}
                        className={`like-btn ${isLiked ? 'liked' : ''}`}
                      >
                        <Heart className="heart-icon" />
                        <span className="like-count">{testimonial.likes + (isLiked ? 1 : 0)}</span>
                      </button>

                      <button className="comment-btn">
                        <MessageCircle className="message-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredTestimonials.length === 0 && (
          <div className="no-results">
            <Search className="no-results-icon" />
            <h3 className="no-results-title">No testimonials found</h3>
            <p className="no-results-text">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterBadge('all');
              }}
              className="reset-btn"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Comment Section */}
        <div className="comment-form-section">
          <div className="comment-form-container">
            <h2 className="form-title">
              <Send className="send-icon" />
              Share Your Success Story
            </h2>
            
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Tell us about your experience with our community..."
                className="comment-textarea"
              />
              
              <button
                type="submit"
                className="submit-btn"
                disabled={!commentText.trim()}
              >
                <Send className="btn-icon" />
                Post Comment
              </button>
            </form>
          </div>
        </div>

        {/* Load More Button */}
        {displayCount < filteredTestimonials.length && (
          <div className="load-more-section">
            <button
              onClick={loadMore}
              className="load-more-btn"
            >
              Load More Stories
              <ChevronDown className="bounce-icon" />
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-container">
            <div className="cta-overlay"></div>
            <div className="cta-content">
              <div className="cta-badge">
                <Shield className="cta-badge-icon" />
                <span>Trusted by 10,000+ Members</span>
              </div>
              <h2 className="cta-title">Ready to Join Our Community?</h2>
              <p className="cta-text">
                Be part of our growing community of satisfied members across Kenya. Your success story starts here!
              </p>
              <a href="/pricing" className="cta-btn-link">
                <button className="cta-btn">
                  Join Now 
                  <span className="arrow">→</span>
                </button>
              </a>
              
              <div className="cta-features">
                <div className="cta-feature">
                  <CheckCircle className="feature-icon" />
                  <span>24/7 Support</span>
                </div>
                <div className="cta-feature">
                  <CheckCircle className="feature-icon" />
                  <span>Expert Guidance</span>
                </div>
                <div className="cta-feature">
                  <CheckCircle className="feature-icon" />
                  <span>Proven Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Copyright Footer */}
        <div className="copyright-footer">
          <p className="copyright-text">© 2024 Mega-Odds. All rights reserved.</p>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="modal-overlay" onClick={() => setShowSubscriptionModal(false)}>
          <div className="modal-content subscription-modal" onClick={(e) => e.stopPropagation()}>
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
                Join our community to share your thoughts and connect with other members
              </p>
            </div>

            <div className="plans-list">
              <div className="plan-card starter-plan">
                <div className="plan-header">
                  <span className="plan-name">Starter Plan</span>
                  <span className="plan-tag">Basic Access</span>
                </div>
                <p className="plan-description">Perfect for getting started with essential features</p>
                <div className="plan-features">
                  <div className="plan-feature">
                    <CheckCircle className="feature-check" />
                    <span>Basic Tips</span>
                  </div>
                  <div className="plan-feature">
                    <CheckCircle className="feature-check" />
                    <span>Community Access</span>
                  </div>
                </div>
              </div>

              <div className="plan-card pro-plan">
                <div className="plan-ribbon">Most Popular</div>
                <div className="plan-header">
                  <span className="plan-name">Pro Plan</span>
                  <span className="plan-tag popular">Popular</span>
                </div>
                <p className="plan-description">Advanced features with priority support</p>
                <div className="plan-features">
                  <div className="plan-feature">
                    <CheckCircle className="feature-check" />
                    <span>Premium Tips</span>
                  </div>
                  <div className="plan-feature">
                    <CheckCircle className="feature-check" />
                    <span>Priority Support</span>
                  </div>
                  <div className="plan-feature">
                    <CheckCircle className="feature-check" />
                    <span>Advanced Analytics</span>
                  </div>
                </div>
              </div>

              <div className="plan-card vip-plan">
                <div className="plan-header">
                  <span className="plan-name">VIP Elite Plan</span>
                  <span className="plan-tag premium">Premium</span>
                </div>
                <p className="plan-description">Exclusive benefits with full platform access</p>
                <div className="plan-features">
                  <div className="plan-feature">
                    <CheckCircle className="feature-check" />
                    <span>VIP Tips</span>
                  </div>
                  <div className="plan-feature">
                    <CheckCircle className="feature-check" />
                    <span>1-on-1 Consultation</span>
                  </div>
                  <div className="plan-feature">
                    <CheckCircle className="feature-check" />
                    <span>Full Access</span>
                  </div>
                </div>
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

      {/* Enhanced Profile Modal */}
      {selectedProfile && (
        <div className="modal-overlay" onClick={() => setSelectedProfile(null)}>
          <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedProfile(null)}
              className="modal-close"
            >
              <X className="close-icon" />
            </button>

            <div className="profile-modal-header">
              <div className={`profile-avatar bg-gradient-${selectedProfile.color}`}>
                {selectedProfile.avatar}
                <div className="avatar-ring-large"></div>
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

              <div className="profile-meta">
                <div className={`profile-status ${selectedProfile.status}`}>
                  <div className="profile-status-dot"></div>
                  {selectedProfile.status}
                </div>
                
                <div className="profile-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`star-icon-small ${i < selectedProfile.rating ? 'filled' : ''}`}
                    />
                  ))}
                  <span className="rating-text">{selectedProfile.rating}.0</span>
                </div>
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

              <div className="detail-card contact-card">
                <div className="detail-header">
                  <Mail className="detail-icon" />
                  <span className="detail-label">Email</span>
                </div>
                <div className="contact-locked">
                  <p className="lock-message">
                    <Shield className="shield-icon" />
                    User email is only visible to admin for security
                  </p>
                </div>
              </div>

              <div className="detail-card contact-card">
                <div className="detail-header">
                  <Phone className="detail-icon" />
                  <span className="detail-label">Phone</span>
                </div>
                <p className="detail-value masked">{maskPhone(selectedProfile.phone)}</p>
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

import React, { useState } from 'react';
import { cardDataVi, gameRulesVi, cardClassesVi, CardInfoVi } from '../helpers/cardDataVi';
import '../style/guide.css';

const GameGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'cards'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter cards based on search query and selected class
  const filteredCards = cardDataVi.filter(card => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.effectVi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClass === 'all' || card.class === selectedClass;

    return matchesSearch && matchesClass;
  });

  const toggleExpandCard = (cardName: string) => {
    if (expandedCard === cardName) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardName);
    }
  };

  const renderRulesTab = () => (
    <div className="rules-section">
      <div className="rule-card">
        <h3>
          <span className="material-symbols-outlined">emoji_events</span>
          {gameRulesVi.objective.title}
        </h3>
        <p className="rule-content">{gameRulesVi.objective.content}</p>
      </div>

      <div className="rule-card">
        <h3>
          <span className="material-symbols-outlined">bolt</span>
          {gameRulesVi.actionPoints.title}
        </h3>
        <p className="rule-content">{gameRulesVi.actionPoints.content}</p>
      </div>

      <h3 className="section-title">Cơ Chế Trò Chơi</h3>
      <div className="mechanics-grid">
        {gameRulesVi.mechanics.map((mech, index) => (
          <div className="mechanic-card" key={index}>
            <h4>{mech.name}</h4>
            <p>{mech.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCardsTab = () => (
    <div className="cards-section">
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Tìm tên hoặc kỹ năng..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="guide-search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        <div className="class-filter-select-wrapper">
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="guide-class-select"
          >
            <option value="all">Tất cả loại thẻ ({cardDataVi.length})</option>
            {Object.keys(cardClassesVi).map(key => (
              <option key={key} value={key}>
                {cardClassesVi[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cards-list-container">
        {filteredCards.length > 0 ? (
          filteredCards.map((card: CardInfoVi) => {
            const isExpanded = expandedCard === card.name;
            return (
              <div
                className={`guide-card-item ${isExpanded ? 'expanded' : ''} type-${card.type}`}
                key={card.name}
                onClick={() => toggleExpandCard(card.name)}
              >
                <div className="guide-card-header">
                  <div className="card-title-group">
                    <span className="card-class-badge">{card.classVi}</span>
                    <h4 className="card-name-vi">{card.nameVi}</h4>
                    <span className="card-name-en">{card.name}</span>
                  </div>
                  <div className="card-header-right">
                    {card.rollReq && (
                      <span className="card-roll-req">
                        <span className="material-symbols-outlined">casino</span>
                        {card.rollReq}
                      </span>
                    )}
                    <span className="material-symbols-outlined expand-arrow">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="guide-card-body" onClick={e => e.stopPropagation()}>
                    <div className="divider"></div>
                    <div className="card-effect-label">Hiệu ứng / Kỹ năng:</div>
                    <p className="card-effect-text">{card.effectVi}</p>
                    {card.failReq && (
                      <div className="card-fail-req">
                        <strong>Hình phạt (Nếu thất bại {card.failReq}):</strong>
                        <p>{card.nameVi} sẽ gây hình phạt nếu đổ xúc xắc dưới {card.failReq.replace('<', '')}.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-cards-found">
            <span className="material-symbols-outlined">search_off</span>
            <p>Không tìm thấy thẻ bài nào khớp với bộ lọc.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View Sidebar */}
      <div className="game-guide-desktop">
        <div className="guide-header">
          <h2>Cẩm Nang & Thư Viện</h2>
          <div className="guide-tabs">
            <button
              className={`guide-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => setActiveTab('rules')}
            >
              Luật Chơi
            </button>
            <button
              className={`guide-tab-btn ${activeTab === 'cards' ? 'active' : ''}`}
              onClick={() => setActiveTab('cards')}
            >
              Thư Viện Thẻ
            </button>
          </div>
        </div>
        <div className="guide-body">
          {activeTab === 'rules' ? renderRulesTab() : renderCardsTab()}
        </div>
      </div>

      {/* Mobile Floating Button */}
      <button
        className="game-guide-mobile-toggle"
        onClick={() => setIsDrawerOpen(true)}
        title="Mở cẩm nang game"
      >
        <span className="material-symbols-outlined">menu_book</span>
      </button>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div className="game-guide-mobile-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="game-guide-mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Cẩm Nang & Thư Viện</h3>
              <button className="close-drawer-btn" onClick={() => setIsDrawerOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="drawer-tabs">
              <button
                className={`drawer-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
                onClick={() => setActiveTab('rules')}
              >
                Luật Chơi
              </button>
              <button
                className={`drawer-tab-btn ${activeTab === 'cards' ? 'active' : ''}`}
                onClick={() => setActiveTab('cards')}
              >
                Thư Viện Thẻ
              </button>
            </div>
            <div className="drawer-body">
              {activeTab === 'rules' ? renderRulesTab() : renderCardsTab()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameGuide;

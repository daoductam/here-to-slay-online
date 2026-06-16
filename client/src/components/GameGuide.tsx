import React, { useState } from 'react';
import { cardDataVi, gameRulesVi, cardClassesVi, CardInfoVi } from '../helpers/cardDataVi';
import { everyCard } from '../cards';
import { getImage } from '../helpers/getImage';
import { AnyCard } from '../types';
import '../style/guide.css';

const GameGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'cards'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Helper to resolve card image path by English name
  const getCardImagePath = (cardName: string): string => {
    const cardObj = everyCard.find(
      c => typeof c !== 'string' && c.name.toLowerCase() === cardName.toLowerCase()
    ) as AnyCard | undefined;
    if (cardObj) {
      return getImage(cardObj) || '';
    }
    return '';
  };

  // Filter cards based on search query and selected class
  const filteredCards = cardDataVi.filter(card => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.effectVi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClass === 'all' || card.class === selectedClass;

    return matchesSearch && matchesClass;
  });

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
            const imgPath = getCardImagePath(card.name);
            return (
              <div
                className={`guide-card-item type-${card.type}`}
                key={card.name}
              >
                <div className="guide-card-img-holder">
                  {imgPath ? (
                    <img
                      src={imgPath}
                      alt={card.name}
                      className="guide-card-image"
                      draggable="false"
                      loading="lazy"
                    />
                  ) : (
                    <div className="guide-card-placeholder">
                      <span className="material-symbols-outlined">style</span>
                    </div>
                  )}
                  {card.rollReq && (
                    <span className="card-roll-badge">
                      <span className="material-symbols-outlined">casino</span>
                      {card.rollReq}
                    </span>
                  )}
                </div>

                <div className="guide-card-details">
                  <span className="card-class-badge">{card.classVi}</span>
                  <h4 className="card-name-vi">{card.nameVi}</h4>
                  <span className="card-name-en">{card.name}</span>
                  
                  <div className="divider"></div>
                  
                  <p className="card-effect-text">{card.effectVi}</p>
                  
                  {card.failReq && (
                    <div className="card-fail-badge-vi">
                      Phạt nếu đổ {card.failReq}
                    </div>
                  )}
                </div>
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

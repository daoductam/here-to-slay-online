import React, { useState } from 'react';
import { cardDataVi, gameRulesVi, cardClassesVi, CardInfoVi } from '../helpers/cardDataVi';
import { everyCard } from '../cards';
import { getImage } from '../helpers/getImage';
import { AnyCard } from '../types';
import { expansionCards, ExpansionCard } from '../helpers/expansionCardData';
import '../style/guide.css';

const expansionViMap: { [key: string]: string } = {
  BerserkersAndNecromancers: 'Berserkers & Necromancers',
  DragonSorcerers: 'Dragon Sorcerers',
  KSE: 'Kickstarter Exclusive (KSE)',
  MonsterExpansion: 'Monster Expansion',
  WarriorsAndDruids: 'Warriors & Druids',
  BannerQuest: 'Banner Quest',
  HeretoSleigh: 'Here to Sleigh'
};

const expansionClassesVi: { [key: string]: string } = {
  ...cardClassesVi,
  druid: 'Hiền Triết (Druid)',
  warrior: 'Đấu Sĩ (Warrior)',
  berserker: 'Berserker',
  necromancer: 'Necromancer',
  sorcerer: 'Sorcerer',
  noclass: 'Không Lớp Nhân Vật'
};

const GameGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'cards' | 'expansion'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedExpansion, setSelectedExpansion] = useState<string>('all');
  const [selectedExpansionClass, setSelectedExpansionClass] = useState<string>('all');
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

  // Filter expansion cards based on search query, selected expansion and class
  const filteredExpansionCards = expansionCards.filter(card => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.effectVi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesExpansion = selectedExpansion === 'all' || card.expansion === selectedExpansion;
    const matchesClass = selectedExpansionClass === 'all' || card.class === selectedExpansionClass;

    return matchesSearch && matchesExpansion && matchesClass;
  });

  const renderRulesTab = () => (
    <div className="rules-section">
      <div className="rule-card">
        <h3>
          <span className="material-symbols-outlined">emoji_events</span>
          {gameRulesVi.objective.title}
        </h3>
        <p className="rule-content" style={{ whiteSpace: 'pre-line' }}>{gameRulesVi.objective.content}</p>
      </div>

      <div className="rule-card">
        <h3>
          <span className="material-symbols-outlined">bolt</span>
          {gameRulesVi.actionPoints.title}
        </h3>
        <p className="rule-content" style={{ whiteSpace: 'pre-line' }}>{gameRulesVi.actionPoints.content}</p>
      </div>

      <div className="rule-card">
        <h3>
          <span className="material-symbols-outlined">format_list_numbered</span>
          {gameRulesVi.turnStructure.title}
        </h3>
        <p className="rule-content" style={{ whiteSpace: 'pre-line' }}>{gameRulesVi.turnStructure.content}</p>
      </div>

      <div className="rule-card">
        <h3>
          <span className="material-symbols-outlined">style</span>
          {gameRulesVi.cardTypes.title}
        </h3>
        <p className="rule-content" style={{ whiteSpace: 'pre-line' }}>{gameRulesVi.cardTypes.content}</p>
      </div>

      <div className="rule-card">
        <h3>
          <span className="material-symbols-outlined">extension</span>
          {gameRulesVi.expansions.title}
        </h3>
        <p className="rule-content" style={{ whiteSpace: 'pre-line' }}>{gameRulesVi.expansions.content}</p>
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

  const renderExpansionTab = () => {
    // Collect unique expansions and classes from the cards list for the filters
    const uniqueExpansions = Array.from(new Set(expansionCards.map(c => c.expansion)));
    const uniqueClasses = Array.from(new Set(expansionCards.map(c => c.class))).filter(Boolean);

    return (
      <div className="cards-section">
        <div className="search-filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="search-input-wrapper" style={{ width: '100%' }}>
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Tìm tên hoặc mô tả thẻ mở rộng..."
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

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <div className="class-filter-select-wrapper" style={{ flex: 1 }}>
              <select
                value={selectedExpansion}
                onChange={e => setSelectedExpansion(e.target.value)}
                className="guide-class-select"
              >
                <option value="all">Tất cả bản mở rộng ({expansionCards.length})</option>
                {uniqueExpansions.map(exp => (
                  <option key={exp} value={exp}>
                    {expansionViMap[exp] || exp}
                  </option>
                ))}
              </select>
            </div>

            <div className="class-filter-select-wrapper" style={{ flex: 1 }}>
              <select
                value={selectedExpansionClass}
                onChange={e => setSelectedExpansionClass(e.target.value)}
                className="guide-class-select"
              >
                <option value="all">Tất cả lớp nhân vật</option>
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls}>
                    {expansionClassesVi[cls] || cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="cards-list-container">
          {filteredExpansionCards.length > 0 ? (
            filteredExpansionCards.map((card: ExpansionCard, idx) => {
              return (
                <div
                  className={`guide-card-item type-${card.type}`}
                  key={`${card.name}-${idx}`}
                >
                  <div className="guide-card-img-holder">
                    <img
                      src={`${process.env.PUBLIC_URL}/${card.imagePath}`}
                      alt={card.name}
                      className="guide-card-image"
                      draggable="false"
                      loading="lazy"
                      onError={(e) => {
                        // fallback to placeholder if image fails to load
                        (e.target as HTMLElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentNode;
                        if (parent) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'guide-card-placeholder';
                          placeholder.innerHTML = '<span class="material-symbols-outlined">style</span>';
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                    {card.rollReq && (
                      <span className="card-roll-badge">
                        <span className="material-symbols-outlined">casino</span>
                        {card.rollReq}
                      </span>
                    )}
                  </div>

                  <div className="guide-card-details">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="card-class-badge" style={{ margin: 0 }}>{card.classVi}</span>
                      <span className="card-class-badge" style={{ margin: 0, backgroundColor: 'rgba(252, 124, 55, 0.15)', color: '#fc7c37' }}>
                        {expansionViMap[card.expansion] || card.expansion}
                      </span>
                    </div>
                    <h4 className="card-name-vi" style={{ fontSize: '1.7vh' }}>{card.nameVi}</h4>
                    <span className="card-name-en" style={{ marginBottom: '6px' }}>{card.name}</span>
                    
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
              <p>Không tìm thấy thẻ bài mở rộng nào khớp với bộ lọc.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rules':
        return renderRulesTab();
      case 'cards':
        return renderCardsTab();
      case 'expansion':
        return renderExpansionTab();
      default:
        return renderRulesTab();
    }
  };

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
            <button
              className={`guide-tab-btn ${activeTab === 'expansion' ? 'active' : ''}`}
              onClick={() => setActiveTab('expansion')}
            >
              Mở Rộng
            </button>
          </div>
        </div>
        <div className="guide-body">
          {renderTabContent()}
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
              <button
                className={`drawer-tab-btn ${activeTab === 'expansion' ? 'active' : ''}`}
                onClick={() => setActiveTab('expansion')}
              >
                Mở Rộng
              </button>
            </div>
            <div className="drawer-body">
              {renderTabContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameGuide;

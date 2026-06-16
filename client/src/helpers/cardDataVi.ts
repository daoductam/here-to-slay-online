export interface CardInfoVi {
  name: string;
  nameVi: string;
  class: string;
  classVi: string;
  type: string;
  typeVi: string;
  rollReq?: string;
  failReq?: string;
  effectVi: string;
}

export const cardClassesVi: { [key: string]: string } = {
  bard: 'Nhạc Sĩ',
  fighter: 'Chiến Binh',
  guardian: 'Hộ Vệ',
  ranger: 'Cung Thủ',
  thief: 'Sát Thủ',
  wizard: 'Phù Thủy',
  large: 'Quái Vật / Thủ Lĩnh',
  item: 'Vật Phẩm',
  magic: 'Phép Thuật',
  modifier: 'Bổ Trợ',
  challenge: 'Thách Thức'
};

export const gameRulesVi = {
  title: 'Cẩm Nang Luật Chơi',
  objective: {
    title: 'Mục Tiêu Thắng Cuộc',
    content: 'Để giành chiến thắng, bạn phải đạt được một trong hai điều kiện sau:\n1. Tiêu diệt thành công 3 lá bài Quái Vật (Monster).\n2. Thu thập đủ 6 lớp Anh Hùng (Hero class) khác nhau trên bàn chơi của bạn (bao gồm cả lá bài Thủ Lĩnh/Party Leader của bạn).'
  },
  actionPoints: {
    title: 'Điểm Hành Động (Action Points - AP)',
    content: 'Mỗi lượt chơi bạn sẽ bắt đầu với 3 Điểm Hành Động (AP). Bạn có thể chi tiêu AP để thực hiện các hành động sau:\n• Rút 1 lá bài: Tốn 1 AP.\n• Đánh 1 lá bài từ tay (Anh Hùng, Phép Thuật, Vật Phẩm): Tốn 1 AP.\n• Kích hoạt kỹ năng của 1 Anh Hùng đã ở trên bàn: Tốn 1 AP (phải đổ xúc xắc đạt yêu cầu).\n• Tấn công Quái Vật: Tốn 2 AP (phải thỏa mãn yêu cầu về lớp nhân vật và đổ xúc xắc để phân định thắng/thua).\n• Đổi bài: Bỏ toàn bộ bài trên tay và rút 5 lá bài mới: Tốn 3 AP.'
  },
  mechanics: [
    {
      name: 'Thách Thức (Challenge)',
      desc: 'Khi đối thủ chuẩn bị đánh một lá bài Anh Hùng, Phép Thuật hoặc Vật Phẩm từ tay, bạn có thể đánh ngay lá Challenge từ tay để thách đấu. Cả hai người chơi cùng đổ xúc xắc. Nếu điểm của bạn LỚN HƠN HOẶC BẰNG điểm của đối thủ, bạn thắng và lá bài của đối thủ sẽ bị hủy bỏ ngay lập tức (không tốn AP).'
    },
    {
      name: 'Bổ Trợ (Modifier)',
      desc: 'Lá bài Bổ Trợ có thể được đánh trực tiếp từ tay sau bất kỳ lượt đổ xúc xắc nào (của bạn hoặc của đối thủ). Bạn có thể cộng thêm hoặc trừ bớt điểm đổ xúc xắc để giúp bản thân đạt yêu cầu kích hoạt kỹ năng, hoặc phá hoại lượt đổ xúc xắc của đối thủ.'
    },
    {
      name: 'Vật Phẩm (Item)',
      desc: 'Lá bài Vật Phẩm có thể được gắn vào các Anh Hùng trên bàn chơi. Vật Phẩm Ban Phước (Blessed Item) mang lại hiệu ứng có lợi (như tăng điểm đổ xúc xắc), trong khi Vật Phẩm Nguyền Rủa (Cursed Item) mang lại hiệu ứng bất lợi (như giảm điểm đổ xúc xắc của Anh Hùng đó).'
    }
  ]
};

export const cardDataVi: CardInfoVi[] = [
  // Leaders
  {
    name: 'The Charismatic Song',
    nameVi: 'Khúc Ca Hút Hồn',
    class: 'bard',
    classVi: 'Thủ Lĩnh Nhạc Sĩ',
    type: 'leader',
    typeVi: 'Thủ Lĩnh',
    effectVi: 'Mỗi khi bạn đổ xúc xắc cho kỹ năng của một thẻ Anh Hùng, cộng thêm 1 vào kết quả.'
  },
  {
    name: 'The Cloaked Sage',
    nameVi: 'Nhà Hiền Triết Ẩn Danh',
    class: 'wizard',
    classVi: 'Thủ Lĩnh Phù Thủy',
    type: 'leader',
    typeVi: 'Thủ Lĩnh',
    effectVi: 'Mỗi khi bạn đánh một lá bài Phép Thuật, bạn có thể rút thêm 1 lá bài.'
  },
  {
    name: 'The Divine Arrow',
    nameVi: 'Mũi Tên Thần Thánh',
    class: 'ranger',
    classVi: 'Thủ Lĩnh Cung Thủ',
    type: 'leader',
    typeVi: 'Thủ Lĩnh',
    effectVi: 'Mỗi khi bạn đổ xúc xắc để Tấn Công Quái Vật, cộng thêm 1 vào kết quả.'
  },
  {
    name: 'The Fist of Reason',
    nameVi: 'Nắm Đấm Lý Trí',
    class: 'fighter',
    classVi: 'Thủ Lĩnh Chiến Binh',
    type: 'leader',
    typeVi: 'Thủ Lĩnh',
    effectVi: 'Mỗi khi bạn thách thức (Challenge) một người chơi khác, cộng thêm 1 vào kết quả đổ xúc xắc.'
  },
  {
    name: 'The Protecting Horn',
    nameVi: 'Tù Và Bảo Hộ',
    class: 'guardian',
    classVi: 'Thủ Lĩnh Hộ Vệ',
    type: 'leader',
    typeVi: 'Thủ Lĩnh',
    effectVi: 'Mỗi khi một người chơi khác cố gắng PHÁ HỦY hoặc CƯỚP ĐOẠT thẻ bài của bạn, cộng thêm 1 vào kết quả đổ xúc xắc phòng thủ.'
  },
  {
    name: 'The Shadow Claw',
    nameVi: 'Móng Vuốt Bóng Đêm',
    class: 'thief',
    classVi: 'Thủ Lĩnh Sát Thủ',
    type: 'leader',
    typeVi: 'Thủ Lĩnh',
    effectVi: 'Mỗi khi bạn cướp (Steal) một thẻ Anh Hùng của đối thủ, bạn có thể chọn bỏ 1 lá bài trên tay và cướp thêm 1 lá bài ngẫu nhiên trên tay đối thủ đó.'
  },

  // Monsters
  {
    name: 'Anuran Cauldron',
    nameVi: 'Vạc Dầu Ếch Ương',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '7+',
    failReq: '<6',
    effectVi: 'Tiêu diệt thành công: Được phép rút 1 lá bài mỗi khi bất kỳ ai đánh một lá Phép Thuật.\nThất bại: Phải hy sinh 1 Anh Hùng trên bàn.'
  },
  {
    name: 'Arctic Aries',
    nameVi: 'Bạch Dương Băng Giá',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '10+',
    failReq: '<6',
    effectVi: 'Tiêu diệt thành công: Thêm +1 AP vào mỗi lượt của bạn.\nThất bại: Phải hy sinh 1 Anh Hùng trên bàn.'
  },
  {
    name: 'Bloodwing',
    nameVi: 'Cánh Máu',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '9+',
    failReq: '<6',
    effectVi: 'Tiêu diệt thành công: Bạn được phép cộng hoặc trừ 1 vào bất kỳ kết quả đổ xúc xắc nào của mình.\nThất bại: Phải hy sinh 1 Anh Hùng trên bàn.'
  },
  {
    name: 'Orthus',
    nameVi: 'Chó Săn Orthus',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '8+',
    failReq: '<4',
    effectVi: 'Tiêu diệt thành công: Được phép rút 1 lá bài mỗi khi bạn đổ xúc xắc kích hoạt kỹ năng Anh Hùng thành công.\nThất bại: Bỏ 2 lá bài trên tay.'
  },
  {
    name: 'Corrupted Sabretooth',
    nameVi: 'Hổ Răng Kiếm Hắc Ám',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '9+',
    failReq: '<6',
    effectVi: 'Tiêu diệt thành công: Bạn không thể bị thách thức (Challenge) bởi bất kỳ ai khi đánh bài Phép Thuật.\nThất bại: Phải hy sinh 1 Anh Hùng trên bàn.'
  },
  {
    name: 'Crowned Serpent',
    nameVi: 'Rắn Vương Vương Miện',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '10+',
    failReq: '<7',
    effectVi: 'Tiêu diệt thành công: Mỗi khi bạn đánh một lá bài Anh Hùng, bạn có thể lập tức đổ xúc xắc kích hoạt kỹ năng của nó miễn phí.\nThất bại: Phải hy sinh 1 Anh Hùng trên bàn.'
  },
  {
    name: 'Abyss Queen',
    nameVi: 'Nữ Hoàng Vực Thẳm',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '8+',
    failReq: '<5',
    effectVi: 'Tiêu diệt thành công: Mỗi khi bạn thách thức đối thủ thành công, được cướp 1 lá bài ngẫu nhiên từ tay đối thủ đó.\nThất bại: Phải hy sinh 1 Anh Hùng trên bàn.'
  },
  {
    name: 'Dracos',
    nameVi: 'Rồng Bán Cổ Long Dracos',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '8+',
    failReq: '<5',
    effectVi: 'Tiêu diệt thành công: Thêm +1 AP vào mỗi lượt của bạn.\nThất bại: Phải hy sinh 1 Anh Hùng trên bàn.'
  },
  {
    name: 'Dark Dragon King',
    nameVi: 'Hắc Long Vương',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '8+',
    failReq: '<7',
    effectVi: 'Tiêu diệt thành công: Mỗi khi bạn đổ xúc xắc, bạn có thể chọn đổi hướng xoay của xúc xắc (cộng thêm hoặc trừ 2 vào kết quả).\nThất bại: Bỏ 2 lá bài trên tay.'
  },
  {
    name: 'Malamammoth',
    nameVi: 'Voi Cổ Đại Malamammoth',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '8+',
    failReq: '<4',
    effectVi: 'Tiêu diệt thành công: Tất cả lá bài Bổ Trợ của bạn đánh ra đều được cộng thêm 1 vào hiệu lực.\nThất bại: Bỏ 2 lá bài trên tay.'
  },
  {
    name: 'Rex Major',
    nameVi: 'Khủng Long Bạo Chúa Rex Major',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '8+',
    failReq: '<4',
    effectVi: 'Tiêu diệt thành công: Đối thủ phải tốn 2 AP nếu muốn thách thức (Challenge) lá bài của bạn.\nThất bại: Bỏ 2 lá bài trên tay.'
  },
  {
    name: 'Terratuga',
    nameVi: 'Rùa Đất Khổng Lồ Terratuga',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '11+',
    failReq: '<7',
    effectVi: 'Tiêu diệt thành công: Các Anh Hùng của bạn hoàn toàn miễn nhiễm với kỹ năng PHÁ HỦY của đối thủ.\nThất bại: Phải hy sinh 1 Anh Hùng trên bàn.'
  },
  {
    name: 'Mega Slime',
    nameVi: 'Siêu Slime Mega Slime',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '8+',
    failReq: '<7',
    effectVi: 'Tiêu diệt thành công: Được phép rút thêm 1 lá bài ở đầu mỗi lượt chơi.\nThất bại: Phải hy sinh 1 Anh Hùng trên bàn.'
  },
  {
    name: 'Titan Wyvern',
    nameVi: 'Phi Long Titan',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '8+',
    failReq: '<4',
    effectVi: 'Tiêu diệt thành công: Được phép hồi lại 1 Anh Hùng từ chồng bài loại lên tay bất kỳ khi nào có Anh Hùng của bạn bị phá hủy.\nThất bại: Bỏ 2 lá bài trên tay.'
  },
  {
    name: 'Warworn Owlbear',
    nameVi: 'Gấu Cú Chiến Binh Owlbear',
    class: 'large',
    classVi: 'Quái Vật',
    type: 'monster',
    typeVi: 'Quái Vật',
    rollReq: '8+',
    failReq: '<4',
    effectVi: 'Tiêu diệt thành công: Bạn được phép dùng 1 AP để cướp 1 Anh Hùng của đối phương (chỉ dùng được 1 lần/lượt).\nThất bại: Bỏ 2 lá bài trên tay.'
  },

  // Bards
  {
    name: 'Dodgy Dealer',
    nameVi: 'Lái Buôn Gian Xảo',
    class: 'bard',
    classVi: 'Nhạc Sĩ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '9+',
    effectVi: 'Đổ xúc xắc 9+: Hoán đổi toàn bộ bài trên tay của bạn với một người chơi khác do bạn chọn.'
  },
  {
    name: 'Fuzzy Cheeks',
    nameVi: 'Má Hồng Mũm Mĩm',
    class: 'bard',
    classVi: 'Nhạc Sĩ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '8+',
    effectVi: 'Đổ xúc xắc 8+: Rút 1 lá bài, sau đó bạn có thể đánh ngay 1 lá Anh Hùng từ tay xuống bàn.'
  },
  {
    name: 'Greedy Cheeks',
    nameVi: 'Má Hồng Tham Lam',
    class: 'bard',
    classVi: 'Nhạc Sĩ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '8+',
    effectVi: 'Đổ xúc xắc 8+: Mỗi người chơi khác phải tự chọn 1 lá bài trên tay của họ và chuyển cho bạn.'
  },
  {
    name: 'Lucky Bucky',
    nameVi: 'Hươu May Mắn Bucky',
    class: 'bard',
    classVi: 'Nhạc Sĩ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '7+',
    effectVi: 'Đổ xúc xắc 7+: Chọn ngẫu nhiên cướp 1 lá bài trên tay của người chơi khác. Nếu đó là lá Anh Hùng, bạn có thể đánh nó ngay lập tức.'
  },
  {
    name: 'Mellow Dee',
    nameVi: 'Giai Điệu Êm Dịu',
    class: 'bard',
    classVi: 'Nhạc Sĩ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '7+',
    effectVi: 'Đổ xúc xắc 7+: Rút 1 lá bài, sau đó bạn có thể đánh ngay 1 lá Anh Hùng từ tay xuống bàn.'
  },
  {
    name: 'Napping Nibbles',
    nameVi: 'Thỏ Lười Napping Nibbles',
    class: 'bard',
    classVi: 'Nhạc Sĩ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '2+',
    effectVi: 'Đổ xúc xắc 2+: Không làm gì cả. (Kỹ năng ngủ gật cực kỳ dễ kích hoạt nhưng vô dụng).'
  },
  {
    name: 'Peanut',
    nameVi: 'Hạt Đậu Peanut',
    class: 'bard',
    classVi: 'Nhạc Sĩ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '7+',
    effectVi: 'Đổ xúc xắc 7+: Rút thêm 2 lá bài từ bộ bài.'
  },
  {
    name: 'Tipsy Tootie',
    nameVi: 'Bạch Dương Say Xỉn Tootie',
    class: 'bard',
    classVi: 'Nhạc Sĩ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '6+',
    effectVi: 'Đổ xúc xắc 6+: Hoán đổi lá bài Tipsy Tootie này với 1 lá bài Anh Hùng của người chơi khác trên bàn.'
  },

  // Fighters
  {
    name: 'Bad Axe',
    nameVi: 'Rìu Xấu Xa',
    class: 'fighter',
    classVi: 'Chiến Binh',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '8+',
    effectVi: 'Đổ xúc xắc 8+: PHÁ HỦY 1 lá Anh Hùng trên bàn của đối phương (bỏ vào chồng bài loại).'
  },
  {
    name: 'Bear Claw',
    nameVi: 'Vuốt Gấu',
    class: 'fighter',
    classVi: 'Chiến Binh',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '7+',
    effectVi: 'Đổ xúc xắc 7+: Rút ngẫu nhiên 1 lá bài trên tay đối thủ. Nếu đó là lá Anh Hùng, rút thêm 1 lá nữa từ tay đối thủ đó.'
  },
  {
    name: 'Beary Wise',
    nameVi: 'Gấu Uyên Bác',
    class: 'fighter',
    classVi: 'Chiến Binh',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '7+',
    effectVi: 'Đổ xúc xắc 7+: Mỗi người chơi khác phải tự bỏ 1 lá bài trên tay họ vào chồng bài loại. Sau đó bạn được rút 1 lá.'
  },
  {
    name: 'Fury Knuckle',
    nameVi: 'Nắm Đấm Phẫn Nộ',
    class: 'fighter',
    classVi: 'Chiến Binh',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '5+',
    effectVi: 'Đổ xúc xắc 5+: Rút ngẫu nhiên 1 lá bài trên tay đối thủ. Nếu đó là lá Thách Thức (Challenge), rút thêm 1 lá nữa từ tay đối thủ đó.'
  },
  {
    name: 'Heavy Bear',
    nameVi: 'Gấu Nặng Ký',
    class: 'fighter',
    classVi: 'Chiến Binh',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '5+',
    effectVi: 'Đổ xúc xắc 5+: Chọn một người chơi khác, buộc họ phải tự loại bỏ 2 lá bài ngẫu nhiên trên tay.'
  },
  {
    name: 'Pan Chucks',
    nameVi: 'Côn Chảo Pan Chucks',
    class: 'fighter',
    classVi: 'Chiến Binh',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '8+',
    effectVi: 'Đổ xúc xắc 8+: Rút 2 lá bài. Tiết lộ chúng. Nếu có ít nhất 1 lá bài Thách Thức (Challenge), PHÁ HỦY 1 lá Anh Hùng của đối thủ.'
  },
  {
    name: 'Qi Bear',
    nameVi: 'Gấu Khí Công',
    class: 'fighter',
    classVi: 'Chiến Binh',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '10+',
    effectVi: 'Đổ xúc xắc 10+: Bạn được phép bỏ tối đa 3 lá bài từ tay vào chồng bài loại. Với mỗi lá bỏ đi, lập tức PHÁ HỦY 1 Anh Hùng của đối thủ.'
  },
  {
    name: 'Tough Teddy',
    nameVi: 'Gấu Bông Đanh Đá',
    class: 'fighter',
    classVi: 'Chiến Binh',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '4+',
    effectVi: 'Đổ xúc xắc 4+: Tất cả những người chơi có ít nhất 1 Anh Hùng lớp Chiến Binh trên bàn chơi của họ đều phải bỏ 1 lá bài từ tay.'
  },

  // Guardians
  {
    name: 'Calming Voice',
    nameVi: 'Giọng Nói Dịu Êm',
    class: 'guardian',
    classVi: 'Hộ Vệ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '9+',
    effectVi: 'Đổ xúc xắc 9+: Các Anh Hùng trên bàn chơi của bạn được bảo vệ hoàn toàn khỏi các hành động CƯỚP ĐOẠT (Steal) cho tới lượt tiếp theo của bạn.'
  },
  {
    name: 'Guiding Light',
    nameVi: 'Ánh Sáng Dẫn Đường',
    class: 'guardian',
    classVi: 'Hộ Vệ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '7+',
    effectVi: 'Đổ xúc xắc 7+: Lục tìm trong chồng bài loại 1 lá bài Anh Hùng và đưa nó về tay của bạn.'
  },
  {
    name: 'Holy Curselifter',
    nameVi: 'Thầy Trục Tà Thánh Thiện',
    class: 'guardian',
    classVi: 'Hộ Vệ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '5+',
    effectVi: 'Đổ xúc xắc 5+: Gỡ bỏ một Vật Phẩm Nguyền Rủa (Cursed Item) đang gắn trên Anh Hùng của bạn và đưa lá đó ngược lại về tay của bạn.'
  },
  {
    name: 'Iron Resolve',
    nameVi: 'Ý Chí Sắt Đá',
    class: 'guardian',
    classVi: 'Hộ Vệ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '8+',
    effectVi: 'Đổ xúc xắc 8+: Các lá bài của bạn được bảo vệ hoàn toàn khỏi Thách Thức (Challenge) cho tới lượt tiếp theo của bạn.'
  },
  {
    name: 'Mighty Blade',
    nameVi: 'Thanh Kiếm Hùng Mạnh',
    class: 'guardian',
    classVi: 'Hộ Vệ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '8+',
    effectVi: 'Đổ xúc xắc 8+: Các Anh Hùng trên bàn chơi của bạn được bảo vệ khỏi bị PHÁ HỦY bởi đối thủ cho tới lượt tiếp theo.'
  },
  {
    name: 'Radiant Horn',
    nameVi: 'Sừng Phát Sáng',
    class: 'guardian',
    classVi: 'Hộ Vệ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '6+',
    effectVi: 'Đổ xúc xắc 6+: Tìm kiếm trong chồng bài loại 1 lá Bổ Trợ (Modifier) và đưa nó về tay.'
  },
  {
    name: 'Vibrant Glow',
    nameVi: 'Hào Quang Rực Rỡ',
    class: 'guardian',
    classVi: 'Hộ Vệ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '9+',
    effectVi: 'Đổ xúc xắc 9+: Cộng thêm 5 vào tất cả các kết quả đổ xúc xắc tiếp theo của bạn trong lượt chơi này.'
  },
  {
    name: 'Wise Shield',
    nameVi: 'Khiên Trí Tuệ',
    class: 'guardian',
    classVi: 'Hộ Vệ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '6+',
    effectVi: 'Đổ xúc xắc 6+: Cộng thêm 3 vào tất cả các kết quả đổ xúc xắc tiếp theo của bạn trong lượt chơi này.'
  },

  // Rangers
  {
    name: 'Bullseye',
    nameVi: 'Hồng Tâm',
    class: 'ranger',
    classVi: 'Cung Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '7+',
    effectVi: 'Đổ xúc xắc 7+: Xem 3 lá bài trên cùng của bộ bài. Lấy 1 lá vào tay của bạn, đặt 2 lá còn lại lên đầu bộ bài theo thứ tự bất kỳ.'
  },
  {
    name: 'Hook',
    nameVi: 'Mũi Tên Móc Câu',
    class: 'ranger',
    classVi: 'Cung Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '6+',
    effectVi: 'Đổ xúc xắc 6+: Đánh 1 lá bài Vật Phẩm từ tay của bạn, sau đó lập tức rút thêm 1 lá từ bộ bài.'
  },
  {
    name: 'Lookie Rookie',
    nameVi: 'Tân Binh Tò Mò',
    class: 'ranger',
    classVi: 'Cung Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '5+',
    effectVi: 'Đổ xúc xắc 5+: Lục tìm trong chồng bài loại 1 lá Vật Phẩm và đưa nó về tay.'
  },
  {
    name: 'Quick Draw',
    nameVi: 'Phản Xạ Cực Nhanh',
    class: 'ranger',
    classVi: 'Cung Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '8+',
    effectVi: 'Đổ xúc xắc 8+: Rút 2 lá bài từ bộ bài, sau đó bạn có thể chơi ngay lập tức tối đa 2 lá Vật Phẩm từ tay.'
  },
  {
    name: 'Serious Grey',
    nameVi: 'Sói Xám Nghiêm Túc',
    class: 'ranger',
    classVi: 'Cung Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '9+',
    effectVi: 'Đổ xúc xắc 9+: PHÁ HỦY 1 lá Anh Hùng của đối thủ, sau đó bạn được phép rút thêm 1 lá.'
  },
  {
    name: 'Sharp Fox',
    nameVi: 'Cáo Sắc Sảo',
    class: 'ranger',
    classVi: 'Cung Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '5+',
    effectVi: 'Đổ xúc xắc 5+: Xem toàn bộ các lá bài trên tay của một người chơi khác do bạn chọn.'
  },
  {
    name: 'Wildshot',
    nameVi: 'Phát Bắn Hoang Dã',
    class: 'ranger',
    classVi: 'Cung Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '8+',
    effectVi: 'Đổ xúc xắc 8+: Rút 3 lá bài từ bộ bài, sau đó bỏ đi 1 lá bài trên tay vào chồng bài loại.'
  },
  {
    name: 'Wily Red',
    nameVi: 'Cáo Đỏ Tinh Ranh',
    class: 'ranger',
    classVi: 'Cung Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '10+',
    effectVi: 'Đổ xúc xắc 10+: Rút thêm bài từ bộ bài cho tới khi bạn có đủ 7 lá bài trên tay.'
  },

  // Thieves
  {
    name: 'Kit Napper',
    nameVi: 'Kẻ Bắt Cóc',
    class: 'thief',
    classVi: 'Sát Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '9+',
    effectVi: 'Đổ xúc xắc 9+: CƯỚP ĐOẠT 1 lá Anh Hùng của đối phương đặt về bàn của bạn.'
  },
  {
    name: 'Meowzio',
    nameVi: 'Sát Thủ Mèo Meowzio',
    class: 'thief',
    classVi: 'Sát Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '10+',
    effectVi: 'Đổ xúc xắc 10+: CƯỚP ĐOẠT 1 lá Anh Hùng trên bàn của đối phương, sau đó rút ngẫu nhiên thêm 1 lá từ tay đối phương đó.'
  },
  {
    name: 'Plundering Puma',
    nameVi: 'Báo Săn Đạo Tặc',
    class: 'thief',
    classVi: 'Sát Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '6+',
    effectVi: 'Đổ xúc xắc 6+: Cướp ngẫu nhiên 2 lá trên tay đối phương, đối phương được rút bù lại 1 lá từ bộ bài.'
  },
  {
    name: 'Shurikitty',
    nameVi: 'Mèo Phi Tiêu Shurikitty',
    class: 'thief',
    classVi: 'Sát Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '9+',
    effectVi: 'Đổ xúc xắc 9+: PHÁ HỦY 1 lá Anh Hùng của đối phương (bỏ vào chồng bài loại). Lá bài Vật phẩm gắn kèm Anh hùng đó sẽ được chuyển về tay của bạn.'
  },
  {
    name: 'Silent Shadow',
    nameVi: 'Bóng Tối Lặng Lẽ',
    class: 'thief',
    classVi: 'Sát Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '8+',
    effectVi: 'Đổ xúc xắc 8+: Xem toàn bộ bài trên tay đối thủ và chọn lấy 1 lá bài đem về tay của bạn.'
  },
  {
    name: 'Slippery Paws',
    nameVi: 'Bàn Tay Trơn Trượt',
    class: 'thief',
    classVi: 'Sát Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '6+',
    effectVi: 'Đổ xúc xắc 6+: Rút ngẫu nhiên 2 lá bài trên tay đối thủ, sau đó tự chọn bỏ 1 lá trên tay của bạn.'
  },
  {
    name: 'Sly Pickings',
    nameVi: 'Kẻ Nhặt Nhạnh',
    class: 'thief',
    classVi: 'Sát Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '6+',
    effectVi: 'Đổ xúc xắc 6+: Rút ngẫu nhiên 1 lá bài từ tay đối thủ. Nếu đó là lá Vật Phẩm, bạn có thể đánh nó ngay lập tức.'
  },
  {
    name: 'Smooth Mimimeow',
    nameVi: 'Mèo Nhỏ Trơn Tru Mimimeow',
    class: 'thief',
    classVi: 'Sát Thủ',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '7+',
    effectVi: 'Đổ xúc xắc 7+: Rút ngẫu nhiên 1 lá bài từ tay của MỖI người chơi có ít nhất 1 Anh Hùng lớp Sát Thủ trên bàn của họ.'
  },

  // Wizards
  {
    name: 'Bun Bun',
    nameVi: 'Thỏ Bun Bun',
    class: 'wizard',
    classVi: 'Phù Thủy',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '5+',
    effectVi: 'Đổ xúc xắc 5+: Lục tìm trong chồng bài loại 1 lá bài Phép Thuật và đưa nó về tay.'
  },
  {
    name: 'Buttons',
    nameVi: 'Cúc Áo Buttons',
    class: 'wizard',
    classVi: 'Phù Thủy',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '6+',
    effectVi: 'Đổ xúc xắc 6+: Rút ngẫu nhiên 1 lá bài trên tay đối thủ, sau đó bạn được phép chơi ngay 1 lá Phép Thuật từ tay.'
  },
  {
    name: 'Fluffy',
    nameVi: 'Bông Xù Fluffy',
    class: 'wizard',
    classVi: 'Phù Thủy',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '10+',
    effectVi: 'Đổ xúc xắc 10+: PHÁ HỦY tối đa 2 lá bài Anh Hùng của các đối thủ khác trên bàn.'
  },
  {
    name: 'Hopper',
    nameVi: 'Ếch Nhảy Hopper',
    class: 'wizard',
    classVi: 'Phù Thủy',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '7+',
    effectVi: 'Đổ xúc xắc 7+: Chọn một người chơi khác, buộc họ phải Hy Sinh (Sacrifice) 1 lá Anh Hùng của họ.'
  },
  {
    name: 'Snowball',
    nameVi: 'Quả Cầu Tuyết Snowball',
    class: 'wizard',
    classVi: 'Phù Thủy',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '6+',
    effectVi: 'Đổ xúc xắc 6+: Rút 1 lá bài và tiết lộ nó. Nếu đó là lá bài Phép Thuật, bạn có thể đánh nó ngay lập tức. Nếu không, hãy bỏ nó vào chồng bài loại.'
  },
  {
    name: 'Spooky',
    nameVi: 'U Hồn Spooky',
    class: 'wizard',
    classVi: 'Phù Thủy',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '10+',
    effectVi: 'Đổ xúc xắc 10+: MỖI người chơi khác đều phải tự chọn Hy Sinh (Sacrifice) 1 lá Anh Hùng của họ.'
  },
  {
    name: 'Whiskers',
    nameVi: 'Râu Mèo Whiskers',
    class: 'wizard',
    classVi: 'Phù Thủy',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '11+',
    effectVi: 'Đổ xúc xắc 11+: CƯỚP ĐOẠT 1 lá Anh Hùng của đối phương, sau đó tiếp tục PHÁ HỦY 1 Anh Hùng của một đối thủ khác.'
  },
  {
    name: 'Wiggles',
    nameVi: 'Mèo Lắc Wiggles',
    class: 'wizard',
    classVi: 'Phù Thủy',
    type: 'hero',
    typeVi: 'Anh Hùng',
    rollReq: '10+',
    effectVi: 'Đổ xúc xắc 10+: CƯỚP ĐOẠT 1 lá Anh Hùng của đối thủ và lập tức kích hoạt kỹ năng của nó miễn phí mà không cần đổ xúc xắc.'
  },

  // Magic Cards
  {
    name: 'Call to the Fallen',
    nameVi: 'Lời Gọi Hồn',
    class: 'magic',
    classVi: 'Phép Thuật',
    type: 'magic',
    typeVi: 'Phép Thuật',
    effectVi: 'Tìm kiếm trong chồng bài loại 1 lá bài Anh Hùng và đưa nó về tay.'
  },
  {
    name: 'Critical Boost',
    nameVi: 'Cường Hóa Lực',
    class: 'magic',
    classVi: 'Phép Thuật',
    type: 'magic',
    typeVi: 'Phép Thuật',
    effectVi: 'Rút 3 lá bài, sau đó tự chọn bỏ 1 lá trên tay.'
  },
  {
    name: 'Destructive Spell',
    nameVi: 'Lời Nguyền Hủy Diệt',
    class: 'magic',
    classVi: 'Phép Thuật',
    type: 'magic',
    typeVi: 'Phép Thuật',
    effectVi: 'Bỏ 1 lá bài trên tay. PHÁ HỦY 1 lá Anh Hùng của đối phương.'
  },
  {
    name: 'Enchanted Spell',
    nameVi: 'Phép Thuật Cường Hóa',
    class: 'magic',
    classVi: 'Phép Thuật',
    type: 'magic',
    typeVi: 'Phép Thuật',
    effectVi: 'Cộng thêm 2 vào tất cả lượt đổ xúc xắc của bạn từ giờ cho đến hết lượt.'
  },
  {
    name: 'Entangling Trap',
    nameVi: 'Bẫy Dây Trói',
    class: 'magic',
    classVi: 'Phép Thuật',
    type: 'magic',
    typeVi: 'Phép Thuật',
    effectVi: 'Bỏ 2 lá bài trên tay. CƯỚP 1 lá Anh Hùng của đối phương.'
  },
  {
    name: 'Forced Exchange',
    nameVi: 'Trao Đổi Cưỡng Ép',
    class: 'magic',
    classVi: 'Phép Thuật',
    type: 'magic',
    typeVi: 'Phép Thuật',
    effectVi: 'Chọn hoán đổi 1 Anh Hùng của bạn với 1 Anh Hùng của đối phương trên bàn.'
  },
  {
    name: 'Forceful Winds',
    nameVi: 'Cơn Gió Dữ Dội',
    class: 'magic',
    classVi: 'Phép Thuật',
    type: 'magic',
    typeVi: 'Phép Thuật',
    effectVi: 'Trả lại toàn bộ các lá Vật Phẩm đang gắn trên tất cả Anh Hùng về tay chủ sở hữu của chúng.'
  },
  {
    name: 'Winds of Change',
    nameVi: 'Luồng Gió Đổi Mới',
    class: 'magic',
    classVi: 'Phép Thuật',
    type: 'magic',
    typeVi: 'Phép Thuật',
    effectVi: 'Đưa 1 lá Vật Phẩm đang gắn trên 1 Anh Hùng về tay của bạn, sau đó RÚT 1 lá bài.'
  },

  // Item Cards
  {
    name: 'Bard Mask',
    nameVi: 'Mặt Nạ Nhạc Sĩ',
    class: 'item',
    classVi: 'Vật Phẩm',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Mặt Nạ Lớp Nhân Vật: Gắn vào Anh Hùng, thay đổi lớp của Anh Hùng đó thành Nhạc Sĩ.'
  },
  {
    name: 'Fighter Mask',
    nameVi: 'Mặt Nạ Chiến Binh',
    class: 'item',
    classVi: 'Vật Phẩm',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Mặt Nạ Lớp Nhân Vật: Gắn vào Anh Hùng, thay đổi lớp của Anh Hùng đó thành Chiến Binh.'
  },
  {
    name: 'Guardian Mask',
    nameVi: 'Mặt Nạ Hộ Vệ',
    class: 'item',
    classVi: 'Vật Phẩm',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Mặt Nạ Lớp Nhân Vật: Gắn vào Anh Hùng, thay đổi lớp của Anh Hùng đó thành Hộ Vệ.'
  },
  {
    name: 'Ranger Mask',
    nameVi: 'Mặt Nạ Cung Thủ',
    class: 'item',
    classVi: 'Vật Phẩm',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Mặt Nạ Lớp Nhân Vật: Gắn vào Anh Hùng, thay đổi lớp của Anh Hùng đó thành Cung Thủ.'
  },
  {
    name: 'Thief Mask',
    nameVi: 'Mặt Nạ Sát Thủ',
    class: 'item',
    classVi: 'Vật Phẩm',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Mặt Nạ Lớp Nhân Vật: Gắn vào Anh Hùng, thay đổi lớp của Anh Hùng đó thành Sát Thủ.'
  },
  {
    name: 'Wizard Mask',
    nameVi: 'Mặt Nạ Phù Thủy',
    class: 'item',
    classVi: 'Vật Phẩm',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Mặt Nạ Lớp Nhân Vật: Gắn vào Anh Hùng, thay đổi lớp của Anh Hùng đó thành Phù Thủy.'
  },
  {
    name: 'Decoy Doll',
    nameVi: 'Búp Bê Thế Mạng',
    class: 'item',
    classVi: 'Vật Phẩm Ban Phước',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Vật Phẩm Ban Phước: Nếu Anh Hùng sở hữu bị PHÁ HỦY hoặc CƯỚP ĐOẠT, thay vào đó hủy bỏ lá bài Búp Bê này.'
  },
  {
    name: 'Particularly Rusty Coin',
    nameVi: 'Đồng Xu Rỉ Sét',
    class: 'item',
    classVi: 'Vật Phẩm Ban Phước',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Vật Phẩm Ban Phước: Cộng 1 vào tất cả kết quả đổ xúc xắc kích hoạt kỹ năng của Anh Hùng này.'
  },
  {
    name: 'Really Big Ring',
    nameVi: 'Nhẫn Siêu Bự',
    class: 'item',
    classVi: 'Vật Phẩm Ban Phước',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Vật Phẩm Ban Phước: Cộng 2 vào tất cả kết quả đổ xúc xắc kích hoạt kỹ năng của Anh Hùng này.'
  },
  {
    name: 'Suspiciously Shiny Coin',
    nameVi: 'Đồng Xu Sáng Bóng Nghi Ngờ',
    class: 'item',
    classVi: 'Vật Phẩm Nguyền Rủa',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Vật Phẩm Nguyền Rủa: Trừ 1 vào tất cả kết quả đổ xúc xắc kích hoạt kỹ năng của Anh Hùng này.'
  },
  {
    name: "Curse of the Snake's Eyes",
    nameVi: 'Lời Nguyền Mắt Rắn',
    class: 'item',
    classVi: 'Vật Phẩm Nguyền Rủa',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Vật Phẩm Nguyền Rủa: Trừ 2 vào tất cả kết quả đổ xúc xắc kích hoạt kỹ năng của Anh Hùng này.'
  },
  {
    name: 'Sealing Key',
    nameVi: 'Chìa Khóa Phong Ấn',
    class: 'item',
    classVi: 'Vật Phẩm Nguyền Rủa',
    type: 'item',
    typeVi: 'Vật Phẩm',
    effectVi: 'Vật Phẩm Nguyền Rủa: Anh Hùng gắn kèm bị khóa hoàn toàn kỹ năng (không thể đổ xúc xắc kích hoạt).'
  },

  // Modifier Cards
  {
    name: '1-3',
    nameVi: 'Bổ Trợ (+1/-3)',
    class: 'modifier',
    classVi: 'Bổ Trợ',
    type: 'modifier',
    typeVi: 'Bổ Trợ',
    effectVi: 'Cộng thêm 1 HOẶC trừ đi 3 vào kết quả bất kỳ lần đổ xúc xắc nào.'
  },
  {
    name: '2-2',
    nameVi: 'Bổ Trợ (+2/-2)',
    class: 'modifier',
    classVi: 'Bổ Trợ',
    type: 'modifier',
    typeVi: 'Bổ Trợ',
    effectVi: 'Cộng thêm 2 HOẶC trừ đi 2 vào kết quả bất kỳ lần đổ xúc xắc nào.'
  },
  {
    name: '3-1',
    nameVi: 'Bổ Trợ (+3/-1)',
    class: 'modifier',
    classVi: 'Bổ Trợ',
    type: 'modifier',
    typeVi: 'Bổ Trợ',
    effectVi: 'Cộng thêm 3 HOẶC trừ đi 1 vào kết quả bất kỳ lần đổ xúc xắc nào.'
  },
  {
    name: '0-4',
    nameVi: 'Bổ Trợ (-4)',
    class: 'modifier',
    classVi: 'Bổ Trợ',
    type: 'modifier',
    typeVi: 'Bổ Trợ',
    effectVi: 'Trừ đi 4 điểm vào kết quả bất kỳ lần đổ xúc xắc nào.'
  },

  // Challenge
  {
    name: 'challenge',
    nameVi: 'Thách Thức (Challenge)',
    class: 'challenge',
    classVi: 'Thách Thức',
    type: 'challenge',
    typeVi: 'Thách Thức',
    effectVi: 'Đánh ra để thách đấu khi đối thủ chuẩn bị đánh 1 lá Anh Hùng, Vật Phẩm hoặc Phép Thuật từ tay.'
  }
];

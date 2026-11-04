/**
 * Utility to suggest brand-appropriate colors for Japanese Credit Cards and Bank Accounts
 */

export interface CardColorSuggestion {
  colorId: string;
  label: string;
  reason: string;
}

export interface AccountColorSuggestion {
  hex: string;
  name: string;
  reason: string;
}

/**
 * Suggests a brand color ID for credit cards based on input text
 */
export function suggestCardColor(cardName: string): CardColorSuggestion | null {
  if (!cardName || !cardName.trim()) return null;
  const name = cardName.trim().toLowerCase();

  if (name.includes('ゴールド') || name.includes('gold')) {
    return { colorId: 'gold', label: 'ゴールド', reason: 'ゴールドカード' };
  }
  if (name.includes('プラチナ') || name.includes('platinum') || name.includes('ブラック') || name.includes('black')) {
    return { colorId: 'slate', label: 'スレート', reason: 'ハイステータスカード' };
  }
  if (name.includes('suica') || name.includes('スイカ') || name.includes('ビュー') || name.includes('jr') || name.includes('東日本')) {
    return { colorId: 'teal', label: 'ティール', reason: 'Suica / ビューカード系' };
  }
  if (name.includes('三井住友') || name.includes('smbc') || name.includes('vポイント') || name.includes('オリーブ') || name.includes('olive')) {
    return { colorId: 'emerald', label: 'エメラルド', reason: '三井住友 / SMBCグループ' };
  }
  if (name.includes('楽天') || name.includes('rakuten')) {
    return { colorId: 'rose', label: 'ローズ', reason: '楽天ブランド' };
  }
  if (name.includes('paypay') || name.includes('ペイペイ')) {
    return { colorId: 'rose', label: 'ローズ', reason: 'PayPayブランド' };
  }
  if (name.includes('jcb')) {
    return { colorId: 'indigo', label: 'インディゴ', reason: 'JCBブランド' };
  }
  if (name.includes('イオン') || name.includes('aeon')) {
    return { colorId: 'fuchsia', label: 'ピンク', reason: 'イオンブランド' };
  }
  if (name.includes('エポス') || name.includes('epos')) {
    return { colorId: 'rose', label: 'ローズ', reason: 'エポスカード' };
  }
  if (name.includes('dカード') || name.includes('docomo') || name.includes('ドコモ')) {
    return { colorId: 'amber', label: 'アンバー', reason: 'dカード / docomo' };
  }
  if (name.includes('au') || name.includes('povo')) {
    return { colorId: 'orange', label: 'オレンジ', reason: 'au PAYカード' };
  }
  if (name.includes('amex') || name.includes('アメックス') || name.includes('アメリカン')) {
    return { colorId: 'cyan', label: 'シアン', reason: 'AMEXブランド' };
  }
  if (name.includes('セゾン') || name.includes('saison')) {
    return { colorId: 'blue', label: 'ブルー', reason: 'セゾンカード' };
  }
  if (name.includes('ヤフー') || name.includes('yahoo')) {
    return { colorId: 'rose', label: 'ローズ', reason: 'Yahoo! JAPAN' };
  }
  if (name.includes('メルカリ') || name.includes('メルペイ') || name.includes('merpay')) {
    return { colorId: 'purple', label: 'パープル', reason: 'メルカード' };
  }
  if (name.includes('ライフ') || name.includes('life')) {
    return { colorId: 'orange', label: 'オレンジ', reason: 'ライフカード' };
  }
  if (name.includes('オリコ') || name.includes('orico')) {
    return { colorId: 'slate', label: 'スレート', reason: 'オリコカード' };
  }
  if (name.includes('三菱') || name.includes('ufj') || name.includes('nicos') || name.includes('ニコス')) {
    return { colorId: 'rose', label: 'ローズ', reason: '三菱UFJ / ニコス' };
  }
  if (name.includes('みずほ')) {
    return { colorId: 'blue', label: 'ブルー', reason: 'みずほグループ' };
  }

  return null;
}

/**
 * Suggests a hex color code for bank accounts based on input text
 */
export function suggestAccountColor(accountName: string): AccountColorSuggestion | null {
  if (!accountName || !accountName.trim()) return null;
  const name = accountName.trim().toLowerCase();

  if (name.includes('三井住友') || name.includes('smbc')) {
    return { hex: '#004B23', name: 'グリーン', reason: '三井住友銀行ブランド' };
  }
  if (name.includes('三菱') || name.includes('ufj') || name.includes('mufg')) {
    return { hex: '#BF0000', name: 'クリムゾン', reason: '三菱UFJ銀行ブランド' };
  }
  if (name.includes('みずほ') || name.includes('mizuho')) {
    return { hex: '#003399', name: 'ブルー', reason: 'みずほ銀行ブランド' };
  }
  if (name.includes('ゆうちょ') || name.includes('jp bank') || name.includes('郵便局')) {
    return { hex: '#FF6600', name: 'オレンジ', reason: 'ゆうちょ銀行ブランド' };
  }
  if (name.includes('りそな') || name.includes('resona')) {
    return { hex: '#10B981', name: 'エメラルド', reason: 'りそな銀行ブランド' };
  }
  if (name.includes('楽天') || name.includes('rakuten')) {
    return { hex: '#BF0000', name: 'クリムゾン', reason: '楽天銀行ブランド' };
  }
  if (name.includes('住信sbi') || name.includes('sbiネット') || name.includes('sbi')) {
    return { hex: '#0284C7', name: 'スカイブルー', reason: '住信SBIネット銀行' };
  }
  if (name.includes('paypay') || name.includes('ペイペイ') || name.includes('ジャパンネット')) {
    return { hex: '#FF0033', name: 'レッド', reason: 'PayPay銀行ブランド' };
  }
  if (name.includes('ソニー') || name.includes('sony')) {
    return { hex: '#0F766E', name: 'ティール', reason: 'ソニー銀行ブランド' };
  }
  if (name.includes('新生') || name.includes('shinsei')) {
    return { hex: '#D97706', name: 'アンバー', reason: 'SBI新生銀行ブランド' };
  }
  if (name.includes('イオン') || name.includes('aeon')) {
    return { hex: '#EC4899', name: 'ピンク', reason: 'イオン銀行ブランド' };
  }
  if (name.includes('あおぞら') || name.includes('aozora')) {
    return { hex: '#0EA5E9', name: 'スカイ', reason: 'あおぞら銀行ブランド' };
  }
  if (name.includes('セブン') || name.includes('seven')) {
    return { hex: '#16A34A', name: 'グリーン', reason: 'セブン銀行ブランド' };
  }
  if (name.includes('メルペイ') || name.includes('メルカリ')) {
    return { hex: '#6B21A8', name: 'パープル', reason: 'メルペイブランド' };
  }
  if (name.includes('ローソン')) {
    return { hex: '#0284C7', name: 'ブルー', reason: 'ローソン銀行' };
  }

  return null;
}

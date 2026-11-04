/**
 * 日本の祝日・金融機関休業日（土日・祝日・年末年始）判定ユーティリティ
 * 銀行法第15条第1項および同施行令第5条に基づく休業日判定
 */

// 春分の日・秋分の日の簡易計算式（1980〜2099年対応）
function getVernalEquinoxDay(year: number): number {
  return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

function getAutumnalEquinoxDay(year: number): number {
  return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

// 第N月曜日（ハッピーマンデー）の計算
function getNthMonday(year: number, month: number, n: number): number {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const offset = (8 - firstDay) % 7;
  return 1 + offset + (n - 1) * 7;
}

/**
 * 指定された日付の祝日名を返す（祝日でなければ null）
 */
export function getJapaneseHolidayName(date: Date): string | null {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // 1月
  if (month === 1) {
    if (day === 1) return '元日';
    if (day === getNthMonday(year, 1, 2)) return '成人の日';
  }
  // 2月
  if (month === 2) {
    if (day === 11) return '建国記念の日';
    if (day === 23) return '天皇誕生日';
  }
  // 3月
  if (month === 3) {
    if (day === getVernalEquinoxDay(year)) return '春分の日';
  }
  // 4月
  if (month === 4) {
    if (day === 29) return '昭和の日';
  }
  // 5月
  if (month === 5) {
    if (day === 3) return '憲法記念日';
    if (day === 4) return 'みどりの日';
    if (day === 5) return 'こどもの日';
  }
  // 7月
  if (month === 7) {
    if (day === getNthMonday(year, 7, 3)) return '海の日';
  }
  // 8月
  if (month === 8) {
    if (day === 11) return '山の日';
  }
  // 9月
  if (month === 9) {
    const keirou = getNthMonday(year, 9, 3);
    const shubun = getAutumnalEquinoxDay(year);
    if (day === keirou) return '敬老の日';
    if (day === shubun) return '秋分の日';
    // 国民の休日（敬老の日と秋分の日に挟まれた平日）
    if (shubun - keirou === 2 && day === keirou + 1) return '国民の休日';
  }
  // 10月
  if (month === 10) {
    if (day === getNthMonday(year, 10, 2)) return 'スポーツの日';
  }
  // 11月
  if (month === 11) {
    if (day === 3) return '文化の日';
    if (day === 23) return '勤労感謝の日';
  }

  // 振替休日判定（祝日が日曜日の場合、その日以降の直近の平日が振替休日）
  // 簡易チェック：過去数日の祝日が日曜か確認
  for (let offset = 1; offset <= 3; offset++) {
    const prevDate = new Date(year, month - 1, day - offset);
    if (prevDate.getDay() === 0) { // 日曜日
      const prevHoliday = getRawHolidayName(prevDate);
      if (prevHoliday) {
        // 前の日曜が祝日で、日〜今日の間が全て祝日なら今日は振替休日
        let allHolidays = true;
        for (let check = 1; check < offset; check++) {
          const mid = new Date(year, month - 1, day - check);
          if (!getRawHolidayName(mid)) {
            allHolidays = false;
            break;
          }
        }
        if (allHolidays && !getRawHolidayName(date)) {
          return '振替休日';
        }
      }
    }
  }

  return null;
}

function getRawHolidayName(date: Date): string | null {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (month === 1 && day === 1) return '元日';
  if (month === 1 && day === getNthMonday(year, 1, 2)) return '成人の日';
  if (month === 2 && day === 11) return '建国記念の日';
  if (month === 2 && day === 23) return '天皇誕生日';
  if (month === 3 && day === getVernalEquinoxDay(year)) return '春分の日';
  if (month === 4 && day === 29) return '昭和の日';
  if (month === 5 && (day === 3 || day === 4 || day === 5)) return '5月祝日';
  if (month === 7 && day === getNthMonday(year, 7, 3)) return '海の日';
  if (month === 8 && day === 11) return '山の日';
  if (month === 9 && day === getNthMonday(year, 9, 3)) return '敬老の日';
  if (month === 9 && day === getAutumnalEquinoxDay(year)) return '秋分の日';
  if (month === 10 && day === getNthMonday(year, 10, 2)) return 'スポーツの日';
  if (month === 11 && (day === 3 || day === 23)) return '11月祝日';

  return null;
}

/**
 * 銀行休業日判定（土曜日、日曜日、国民の祝日、12/31〜1/3の年末年始）
 */
export function isBankHoliday(date: Date): boolean {
  const dayOfWeek = date.getDay();
  // 土曜日(6)または日曜日(0)
  if (dayOfWeek === 0 || dayOfWeek === 6) return true;

  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 年末年始（12月31日〜1月3日）銀行法施行令
  if ((month === 12 && day === 31) || (month === 1 && (day === 1 || day === 2 || day === 3))) {
    return true;
  }

  // 祝日（振替休日含む）
  if (getJapaneseHolidayName(date) !== null) {
    return true;
  }

  return false;
}

/**
 * 指定日が金融機関休業日（土日祝・年末年始）の場合、翌営業日にシフトした日付を返す
 */
export function adjustToNextBankBusinessDay(date: Date): {
  adjustedDate: Date;
  isAdjusted: boolean;
  originalDate: Date;
  reason?: string;
} {
  const originalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  let current = new Date(originalDate.getTime());
  let isAdjusted = false;
  let reasons: string[] = [];

  while (isBankHoliday(current)) {
    isAdjusted = true;
    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0) reasons.push('日曜日');
    else if (dayOfWeek === 6) reasons.push('土曜日');
    else {
      const holiday = getJapaneseHolidayName(current);
      if (holiday) reasons.push(holiday);
      else reasons.push('休業日');
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    adjustedDate: current,
    isAdjusted,
    originalDate,
    reason: isAdjusted ? reasons[0] : undefined,
  };
}

/**
 * 株式関連の定数定義
 */

// 取引所の定数マッピング
export const EXCHANGE_NAMES: Record<string, string> = {
  XNAS: 'NASDAQ',
  XNYS: 'NYSE',
  ARCX: 'NYSE Arca',
  BATS: 'BATS Exchange',
  XASE: 'NYSE American',
  XCHI: 'Chicago Stock Exchange',
  XIEX: 'IEX',
  XBOS: 'NASDAQ OMX BX',
  XPHL: 'NASDAQ OMX PHLX',
  EDGA: 'EDGA Exchange',
  EDGX: 'EDGX Exchange',
  LTSE: 'Long Term Stock Exchange',
  MEMX: 'Members Exchange',
  MIAX: 'MIAX PEARL',
  EPRL: 'MIAX Emerald',
}

// マーケットの定数マッピング
export const MARKET_NAMES: Record<string, string> = {
  stocks: '株式',
  crypto: '仮想通貨',
  fx: '外国為替',
  otc: '店頭取引',
  indices: '指数',
}

// 株式タイプの定数マッピング
export const STOCK_TYPE_NAMES: Record<string, string> = {
  CS: '普通株式',
  ETF: 'ETF',
  PFD: '優先株式',
  ADRC: 'ADR',
  FUND: 'ファンド',
  WARRANT: 'ワラント',
  UNIT: 'ユニット',
  OS: '海外株式',
  SP: '特別目的株式',
}
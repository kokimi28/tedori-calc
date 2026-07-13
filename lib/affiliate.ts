/**
 * アフィリエイト案件の定義。
 *
 * 運用ルール（GOVERNANCE / Tool Factory 規約）:
 *  - ASP の案件 URL を取得したら url を埋め、enabled を true にする。
 *  - リンクは常に rel="sponsored nofollow" + target="_blank" rel="noopener noreferrer"（CTA 側で付与）。
 *  - 1ページに表示するのは最大3本まで（activeOffers が slice(0,3)）。
 *  - url 未取得（enabled=false または url="") の案件は表示されない＝「CTA コメントアウト」状態で先行公開できる。
 */
export interface AffiliateOffer {
  id: string;
  /** CTA の見出し */
  label: string;
  /** 補足説明（1〜2文） */
  description: string;
  /** ASP のアフィリエイトリンク（未取得なら空文字） */
  url: string;
  /** ASP リンク取得後に true にすると表示される */
  enabled: boolean;
}

/**
 * 退職金の税金ツールと相性の良い案件の枠（url はオーナーが ASP 取得後に投入）。
 * enabled=false の間は一切表示されない。
 */
export const AFFILIATE_OFFERS: AffiliateOffer[] = [
  {
    id: "tenshoku-agent",
    label: "退職後のキャリアを相談する（転職エージェント）",
    description: "退職・転職のタイミングや手取りの見通しを、無料でキャリアのプロに相談できます。",
    url: "",
    enabled: false,
  },
  {
    id: "ideco-comparison",
    label: "iDeCo・退職金の受け取り方を比較する",
    description: "一時金と年金、どちらで受け取ると税負担が軽いかを検討したい方向け。",
    url: "",
    enabled: false,
  },
  {
    id: "tax-consult",
    label: "税理士に退職金の申告を相談する",
    description: "確定申告が必要なケースや、還付を受けられる可能性を専門家に確認できます。",
    url: "",
    enabled: false,
  },
];

/** 表示可能な案件（有効かつ URL あり）を最大3件返す */
export function activeOffers(): AffiliateOffer[] {
  return AFFILIATE_OFFERS.filter((o) => o.enabled && o.url.trim() !== "").slice(0, 3);
}

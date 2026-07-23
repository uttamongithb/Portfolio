/** The supplied portfolio HTML is served unchanged from /public/portfolio.html.
 * Keeping it as a document inside the Next.js application preserves every visual detail.
 */
export default function Home(){return <iframe title="Creative developer portfolio" src="/portfolio.html" style={{width:'100%',height:'100vh',border:0,display:'block'}}/>}

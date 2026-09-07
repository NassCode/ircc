export function Header() {
  return (
    <div className="global-header">
      <nav aria-label="Skip links">
        <ul id="wb-tphp">
          <li className="wb-slc"><a className="wb-sl" href="#wb-cont">Skip to main content</a></li>
          <li className="wb-slc"><a className="wb-sl" href="#wb-info">Skip to “About government”</a></li>
          <li className="wb-slc"><a className="wb-sl" href="?wbdisable=true">Switch to basic HTML version</a></li>
        </ul>
      </nav>
      <header>
        <div id="wb-bnr" className="container">
          <div className="row">
            <section id="wb-lng" className="col-xs-3 col-sm-12 pull-right text-right">
              <h2 className="wb-inv">Language selection</h2>
              <div className="row"><div className="col-md-12"><ul className="list-inline mrgn-bttm-0"><li>
                <a lang="fr" href="https://www.canada.ca/fr/immigration-refugies-citoyennete/services/demande/compte.html">
                  <span className="hidden-xs" translate="no">Français</span>
                  <abbr title="Français" className="visible-xs h3 mrgn-tp-sm mrgn-bttm-0 text-uppercase" translate="no">fr</abbr>
                </a>
              </li></ul></div></div>
            </section>
            <div className="brand col-xs-9 col-sm-5 col-md-4">
              <a href="https://www.canada.ca/en.html">
                <img src="/sig-blk-en.svg" alt="Government of Canada" />
                <span className="wb-inv"> / <span lang="fr">Gouvernement du Canada</span></span>
              </a>
            </div>
            <section id="wb-srch" className="col-lg-offset-4 col-md-offset-4 col-sm-offset-2 col-xs-12 col-sm-5 col-md-4">
              <h2>Search</h2>
              <form action="https://www.canada.ca/en/services/immigration-citizenship/search.html" method="get" role="search">
                <div className="form-group wb-srch-qry">
                  <label htmlFor="wb-srch-q" className="wb-inv">Search IRCC</label>
                  <input id="wb-srch-q" className="wb-srch-q form-control" name="q" type="text" size="34" maxLength="170" placeholder="Search IRCC" />
                </div>
                <div className="form-group submit">
                  <button type="submit" id="wb-srch-sub" className="btn btn-primary btn-small" name="wb-srch-sub">
                    <span className="glyphicon glyphicon-search" aria-hidden="true" /><span className="wb-inv">Search</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
        <hr />
        <div className="container"><div className="row"><div className="col-md-8">
          <nav className="gcweb-menu" aria-labelledby="mainMenuBtn">
            <h2 className="wb-inv">Menu</h2>
            <button type="button" aria-haspopup="true" aria-expanded="false" id="mainMenuBtn">
              <span className="wb-inv">Main </span>Menu <span className="expicon glyphicon glyphicon-chevron-down" aria-hidden="true" />
            </button>
          </nav>
        </div></div></div>
        <nav id="wb-bc" aria-label="You are here:"><div className="container"><ol className="breadcrumb">
          <li><a href="https://www.canada.ca/en.html">Canada.ca</a></li>
          <li><a href="https://www.canada.ca/en/services/immigration-citizenship.html">Immigration and citizenship</a></li>
          <li><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/application.html">Your IRCC application</a></li>
        </ol></div></nav>
      </header>
    </div>
  );
}

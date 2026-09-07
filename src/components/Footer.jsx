const canada = "https://www.canada.ca";

export function Footer() {
  return (
    <footer id="wb-info">
      <h2 className="wb-inv">About this site</h2>
      <div className="gc-contextual"><div className="container"><nav>
        <h3>Immigration and citizenship</h3>
        <ul className="list-col-xs-1 list-col-sm-2 list-col-md-3">
          <li><a href={`${canada}/en/immigration-refugees-citizenship/corporate/contact-ircc.html`}>Contact us</a></li>
          <li><a href={`${canada}/en/immigration-refugees-citizenship/services/application/check-processing-times.html`}>Check processing times</a></li>
          <li><a href="https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=660&top=18">How to open a form</a></li>
        </ul>
      </nav></div></div>
      <div className="gc-main-footer"><div className="container"><nav>
        <h3>Government of Canada</h3>
        <ul className="list-col-xs-1 list-col-sm-2 list-col-md-3">
          <li><a href={`${canada}/en/contact.html`}>All contacts</a></li>
          <li><a href={`${canada}/en/government/dept.html`}>Departments and agencies</a></li>
          <li><a href={`${canada}/en/government/system.html`}>About government</a></li>
        </ul>
        <h4><span className="wb-inv">Themes and topics</span></h4>
        <ul className="list-unstyled colcount-sm-2 colcount-md-3">
          <li><a href={`${canada}/en/services/jobs.html`}>Jobs</a></li>
          <li><a href={`${canada}/en/services/immigration-citizenship.html`}>Immigration and citizenship</a></li>
          <li><a href="https://travel.gc.ca/">Travel and tourism</a></li>
          <li><a href={`${canada}/en/services/business.html`}>Business</a></li>
          <li><a href={`${canada}/en/services/benefits.html`}>Benefits</a></li>
          <li><a href={`${canada}/en/services/health.html`}>Health</a></li>
          <li><a href={`${canada}/en/services/taxes.html`}>Taxes</a></li>
          <li><a href={`${canada}/en/services/environment.html`}>Environment and natural resources</a></li>
          <li><a href={`${canada}/en/services/defence.html`}>National security and defence</a></li>
          <li><a href={`${canada}/en/services/culture.html`}>Culture, history and sport</a></li>
          <li><a href={`${canada}/en/services/policing.html`}>Policing, justice and emergencies</a></li>
          <li><a href={`${canada}/en/services/transport.html`}>Transport and infrastructure</a></li>
          <li><a href="https://www.international.gc.ca/world-monde/index.aspx?lang=eng">Canada and the world</a></li>
          <li><a href={`${canada}/en/services/finance.html`}>Money and finances</a></li>
          <li><a href={`${canada}/en/services/science.html`}>Science and innovation</a></li>
          <li><a href={`${canada}/en/services/indigenous-peoples.html`}>Indigenous Peoples</a></li>
          <li><a href={`${canada}/en/services/veterans-military.html`}>Veterans and military</a></li>
          <li><a href={`${canada}/en/services/youth.html`}>Youth</a></li>
          <li><a href={`${canada}/en/services/life-events.html`}>Manage life events</a></li>
        </ul>
      </nav></div></div>
      <div className="gc-sub-footer"><div className="container d-flex align-items-center">
        <nav><h3 className="wb-inv">Government of Canada Corporate</h3><ul>
          <li><a href={`${canada}/en/social.html`}>Social media</a></li>
          <li><a href={`${canada}/en/mobile.html`}>Mobile applications</a></li>
          <li><a href={`${canada}/en/government/about-canada-ca.html`}>About Canada.ca</a></li>
          <li><a href={`${canada}/en/transparency/terms.html`}>Terms and conditions</a></li>
          <li><a href={`${canada}/en/transparency/privacy.html`}>Privacy</a></li>
        </ul></nav>
        <div className="wtrmrk align-self-end"><img src="/assets/wmms-blk.svg" alt="Symbol of the Government of Canada" /></div>
      </div></div>
    </footer>
  );
}

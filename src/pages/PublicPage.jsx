import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const helpTopics = [
  { title: "Errors and issues when you sign in", body: <><p>You can use the same GCKey username and password on different computers, phones and tablets.</p><p><a href="https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1491&top=23.3">Get more help with sign-in issues</a></p></> },
  { title: "You forgot your GCKey password or username", body: <><p>Read the instructions for your situation.</p><p><a href="https://www.canada.ca/en/government/sign-in-online-account/gckey.html">Get more help with GCKey</a></p></> },
  { title: "GCKey two-factor authentication", body: <><p>Two-factor authentication protects your account. You need a second authentication method each time you sign in.</p><p><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/application/two-factor-authentication.html">Get more help with two-factor authentication</a></p></> },
  { title: "GCKey revoked", body: <p>If your GCKey was revoked, choose a different sign-in method or sign up for a new GCKey username and password.</p> },
  { title: "Change your Sign-In Partner", body: <p>If you moved to a new bank or credit union, select Canadian Interac® Sign-In Partner and follow the steps to switch partners.</p> },
  { title: "If you don’t find your application in your account", body: <p>You may need to <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account/link-paper-online.html">link the application to your account</a>.</p> },
  { title: "If your personal reference code doesn’t work", body: <p>Enter the code exactly as shown. Personal reference codes expire 60 days after they are issued.</p> },
  { title: "More help options", body: <p>Visit the <a href="https://ircc.canada.ca/english/helpcentre/index-featured-can.asp">IRCC Help Centre</a> for more answers.</p> },
];

export function PublicPage() {
  return (
    <>
      <Header />
      <main property="mainContentOfPage">
        <div className="container intro-section">
          <h1 id="wb-cont"><span className="stacked"><span>IRCC secure account</span><span>Sign in</span></span></h1>
          <p>We have different accounts for some applications.</p>
          <p><strong>You may need a different account to apply</strong>, depending on the application you submit.</p>
          <h2>Check if this is the right account for you</h2>

          <details>
            <summary><strong>Apply</strong> for these applications</summary>
            <ul>
              <li>work permits</li><li>Express Entry (immigrating as a skilled worker)</li><li>International Experience Canada</li>
              <li>extending work and study permits</li><li>visitor records (to stay in Canada longer)</li>
              <li>change your school (if you have a study permit)</li><li>change conditions on your work permit</li>
              <li>Canadian citizenship certificates (proof of citizenship)</li><li>search of citizenship records</li>
              <li>temporary health benefits for refugees and protected persons (the Interim Federal Health Program)</li>
            </ul>
            <p>You might also need to use this account for these applications, depending on your situation:</p>
            <ul>
              <li>study permits, including those under the Francophone Minority Communities Student Pilot (FMCSP)</li>
              <li>some visitor visas (<a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/apply-visitor-visa.html">get visitor visa instructions for your situation)</a></li>
            </ul>
            <p><strong>If your application isn’t listed, review your program content to get instructions on how to apply:</strong></p>
            <ul>
              <li><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html">Visit Canada</a> (includes visas and electronic travel authorizations)</li>
              <li><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html">Immigrate to Canada</a> (includes family sponsorship, Express Entry and other economic immigration programs)</li>
              <li><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada.html">Work in Canada</a> (includes work permits and International Experience Canada)</li>
              <li><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html">Study in Canada</a> (includes study permits and extensions)</li>
              <li><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship.html">Canadian citizenship</a> (includes applying for citizenship and proof of citizenship)</li>
              <li><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees.html">Refugees and asylum</a> (includes asylum claims and sponsoring refugees)</li>
            </ul>
          </details>

          <details>
            <summary><strong>Check the status</strong> of these applications</summary>
            <ul>
              <li>applications you submitted in this account</li>
              <li>applications you linked to your account, including Express Entry, family sponsorship, permanent resident cards, study permits, visitor visas and work permits</li>
            </ul>
            <p>Can’t find your application? <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-status.html">Get instructions on how to check your application status.</a></p>
          </details>

          <details>
            <summary><strong>Upload requested documents</strong> for these applications</summary>
            <ul>
              <li>applications you submitted in this account (<strong>only if</strong> we ask you for the document)</li>
              <li>electronic travel authorizations (eTA) (<strong>only if</strong> we email you about submitting your documents)</li>
            </ul>
            <p><a href="https://ircc.canada.ca/english/helpcentre/answer.asp?qnum=1310&top=23">Get more help with submitting documents we request.</a></p>
          </details>
        </div>

        <div id="alerts">
          <section className="brdr-0 mrgn-bttm-0 infobg">
            <div className="container">
              <h2 className="wb-inv">Alerts</h2>
              <div className="row mrgn-tp-md hidden-md hidden-lg"><div className="text-center"><span className="fas fa-exclamation-circle fa-2x mrgn-tp-sm" aria-hidden="true" /></div></div>
              <div className="row mrgn-tp-md d-flex align-items-center">
                <div className="col-md-1 col-xs-12 hidden-xs hidden-sm"><div className="text-center"><span className="fas fa-exclamation-circle fa-3x" aria-hidden="true" /></div></div>
                <div className="col-md-11 col-xs-12">
                  <details className="mrgn-tp-0"><summary>Study permit applicants</summary><p>As of 8:30 am ET on January 22, 2024, most students must include a provincial attestation letter (PAL) from the province or territory where they plan to study with their study permit application.</p><p>In most cases, if you apply without a PAL, your application will be returned with fees.</p></details>
                  <details className="mrgn-tp-0"><summary>Delays with the status of your medical exam results</summary><p>You may not see the status of your results updated right away. It may take longer if we need more information from you.</p></details>
                  <details className="mrgn-tp-0"><summary>Student Direct Stream <span className="label label-danger">Closed</span></summary><p>The last day to apply was November 8, 2024, before 2 p.m. ET.</p></details>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="container mrgn-tp-md">
          <div className="alert alert-warning"><h3><em>Sweet</em> class action:</h3><p>A settlement agreement in the <em>Sweet</em> Class Action has been approved by the Federal Court. Learn more about available compensation in the <a href="https://www.canada.ca/en/government/system/digital-government/online-security-privacy/sweet-hmk-class-action-suit/notice-settlement-approval-sweet-v-his-majesty-king-federal-court-file-t-982-20.html">Notice of Settlement Approval</a>.</p></div>
          <div className="alert alert-warning"><p>This online service will be unavailable from <strong>12:00 a.m. to 5:30 a.m. Tuesday, September 8, 2026, Eastern time</strong>, in order to perform system maintenance.</p></div>
        </div>

        <section className="container account-access">
          <h2 className="wb-inv">IRCC secure account access</h2>
          <div className="well well-sm brdr-rds-0 mrgn-tp-md"><div className="panel mrgn-bttm-0 brdr-rds-0"><div className="panel-body">
            <div className="cnjnctn-type-or cnjnctn-md mrgn-tp-0 brdr-0">
              <div className="cnjnctn-col">
                <h3 className="mrgn-tp-sm">Sign in</h3>
                <div className="row mrgn-tp-md"><div className="col-sm-10 col-sm-offset-1"><ul className="list-unstyled lst-spcd-2">
                  <li><Link className="btn btn-primary btn-block p-sm-3" to="/login"><span className="h6 mrgn-tp-0 mrgn-bttm-0 d-flex align-items-center"><span className="fas fa-key fa-lg fa-pull-left" aria-hidden="true" /><span className="text-center full-width">GCKey username and password<span className="wb-inv">GCKey Sign-In</span></span></span></Link></li>
                  <li><Link className="btn btn-primary btn-block p-sm-3" to="/login"><span className="h6 mrgn-tp-0 mrgn-bttm-0 d-flex align-items-center"><span className="fas fa-university fa-lg fa-pull-left" aria-hidden="true" /><span className="text-center full-width">Canadian <i>Interac</i>® Sign-In Partner<span className="wb-inv">bank Sign-In</span></span></span></Link></li>
                </ul></div></div>
                <details className="mrgn-bttm-md"><summary>Not sure how to sign in?</summary><p>You registered with either GCKey or your Canadian banking Sign-In Partner when you created your account.</p><p>Use the option you registered with every time you sign in. It’s tied to your account and user profile.</p><p><a href="#help">Get more help with your account</a>.</p></details>
              </div>
              <div className="cnjnctn-col">
                <h3 className="mrgn-tp-sm">Create an account</h3>
                <div className="row mrgn-tp-md"><div className="col-sm-10 col-sm-offset-1"><Link to="/login" className="btn btn-default btn-block p-sm-3"><span className="h6 mrgn-tp-0 mrgn-bttm-0 d-flex align-items-center"><span className="fas fa-user-edit fa-lg fa-pull-left" aria-hidden="true" /><span className="text-center full-width">Register for an account</span></span></Link></div></div>
              </div>
            </div>
          </div></div></div>
        </section>

        <div className="well brdr-0 brdr-rds-0 mrgn-tp-lg help-band"><section className="container">
          <h2 id="help" className="mrgn-tp-0">Help with your account</h2>
          <div className="row wb-eqht-grd">{helpTopics.map(({ title, body }) => <div className="col-xs-12 col-md-6" key={title}><details><summary>{title}</summary>{body}</details></div>)}</div>
        </section></div>

        <section className="container gc-srvinfo">
          <h2 id="other-accounts" className="mrgn-tp-0">Find another government account</h2>
          <div className="row"><div className="col-xs-12 col-md-6"><h3 className="mrgn-tp-0"><a href="https://www.canada.ca/en/government/sign-in-online-account.html">All Government of Canada online accounts</a></h3><p>There are many accounts across the Government of Canada for different services. Find the service you need.</p></div></div>
        </section>

        <section className="pagedetails container">
          <h2 className="wb-inv">Page details</h2>
          <div className="row"><div className="col-sm-8 col-md-9 col-lg-9"><div className="row"><div className="col-sm-10 col-md-9 col-lg-8 page-feedback"><section className="well mrgn-bttm-0">
            <h3 className="wb-inv">Give feedback about this page</h3>
            <div className="feedback-row"><strong>Did you find what you were looking for?</strong><span><button className="btn btn-primary">Yes</button><button className="btn btn-primary mrgn-lft-sm">No</button></span></div>
          </section></div></div></div></div>
          <p className="date-modified">Date modified: 2026-08-11</p>
        </section>
      </main>
      <Footer />
    </>
  );
}

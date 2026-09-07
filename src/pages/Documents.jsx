import { useData } from '../context/useData';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Documents() {
  const { attached, attachDocument, removeDocument } = useData();

  return (
    <>
      <Header />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 property="name" id="wb-cont" dir="ltr">
              <span>Upload documents</span>
            </h1>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <p>
              Upload the documents requested below to proceed with your application.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Document checklist</h3>
              </div>
              <div class="panel-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Application form</td>
                      <td><span class="label label-success">Provided</span></td>
                      <td>Included with application</td>
                    </tr>
                    <tr>
                      <td>Identity document</td>
                      <td><span class="label label-success">Provided</span></td>
                      <td>Included with application</td>
                    </tr>
                    <tr>
                      <td>Supporting information</td>
                      <td>
                        {attached ? (
                          <span class="label label-success">Uploaded</span>
                        ) : (
                          <span class="label label-warning">Required</span>
                        )}
                      </td>
                      <td>
                        {attached ? (
                          <button onClick={removeDocument} class="btn btn-default btn-sm">Remove</button>
                        ) : (
                          <button onClick={attachDocument} class="btn btn-primary btn-sm">Upload</button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

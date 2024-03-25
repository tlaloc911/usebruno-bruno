import CodeEditor from 'components/CodeEditor/index';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { sendRequest } from 'providers/ReduxStore/slices/collections/actions';
import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import 'pdfjs-dist/build/pdf.worker';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import StyledWrapper from 'components/MarkDown/StyledWrapper';
import { diff_match_patch } from 'components/DiffMatchPatch/diff_match_patch';

const QueryResultPreview = ({
  previewTab,
  allowedPreviewModes,
  data,
  dataBuffer,
  formattedData,
  item,
  contentType,
  collection,
  mode,
  disableRunEventListener,
  displayedTheme
}) => {
  const preferences = useSelector((state) => state.app.preferences);
  const dispatch = useDispatch();

  const [numPages, setNumPages] = useState(null);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  // Fail safe, so we don't render anything with an invalid tab
  if (!allowedPreviewModes.includes(previewTab)) {
    return null;
  }

  const onRun = () => {
    if (disableRunEventListener) {
      return;
    }
    dispatch(sendRequest(item, collection.uid));
  };

  switch (previewTab) {
    case 'diff-preview': {
      var dmp = new diff_match_patch();
      var diff = dmp.diff_main(item.request.docs, data);
      var pretty_diff = dmp.diff_prettyHtml(d);
      const webViewSrc = '<pre>' + pretty_diff + '</pre>';
      return (
        <StyledWrapper>
          <div className="pb-4 w-full" dangerouslySetInnerHTML={{ __html: pretty_diff }} />
        </StyledWrapper>
      );
    }
    case 'preview-web': {
      const webViewSrc = data.replace('<head>', `<head><base href="${item.requestSent?.url || ''}">`);
      return (
        <webview
          src={`data:text/html; charset=utf-8,${encodeURIComponent(webViewSrc)}`}
          webpreferences="disableDialogs=true, javascript=yes"
          className="h-full bg-white"
        />
      );
    }
    case 'preview-image': {
      return <img src={`data:${contentType.replace(/\;(.*)/, '')};base64,${dataBuffer}`} className="mx-auto" />;
    }
    case 'preview-pdf': {
      return (
        <div className="preview-pdf" style={{ height: '100%', overflow: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
          <Document file={`data:application/pdf;base64,${dataBuffer}`} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} renderAnnotationLayer={false} />
            ))}
          </Document>
        </div>
      );
    }
    default:
    case 'raw': {
      return (
        <CodeEditor
          collection={collection}
          font={get(preferences, 'font.codeFont', 'default')}
          theme={displayedTheme}
          onRun={onRun}
          value={formattedData}
          mode={mode}
          readOnly
        />
      );
    }
  }
};

export default QueryResultPreview;

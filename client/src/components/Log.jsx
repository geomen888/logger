import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as R from 'ramda';
import treeChanges from 'tree-changes';
import { getTrans, showAlert,  uploadFile } from 'actions';
import { STATUS } from 'constants/index';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import {
  Button,
  Flex,
 } from 'styled-minimal';
import DataGrid, {
  Column,
  Selection,
  Paging,
  Summary,
  Pager,
  TotalItem
} from "devextreme-react/data-grid";
import Loader from 'components/Loader';
import 'react-toastify/dist/ReactToastify.css';

export class Log extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFile: null,
      loaded: 0
    };
    // autoBind.react(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    logs: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(getTrans({}));
  }

  componentDidUpdate(prevProps) {
    const { dispatch, logs } = this.props;
    const { changedTo } = treeChanges(prevProps, this.props);
    // console.info('componentDidUpdate:prevProps:', prevProps)
    if (changedTo('logs.transactions.status', STATUS.ERROR)) {
      dispatch(showAlert(logs.transaction.message, { variant: 'danger' }));
    }
    if (changedTo('logs.uploading.status', STATUS.ERROR) || changedTo('logs.uploading.status', STATUS.SUCCESS)) {
      this.setState({
        selectedFile: null,
        loaded: 0
      })
    }
  }

  checkMimeType = (event) => {
    const { logs: { mimeTypes } } = this.props;
    //getting file object
    let files = event.target.files
    //define message container
    let err = []
    // list allow mime type
    //const types = ['image/png', 'image/jpeg', 'image/gif']
    // loop access array
    for (let x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (mimeTypes.every(type => files[x].type !== type)) {
        // create error message and assign to container   
        err[x] = files[x].type + ' is not a supported format\n';
      }
    };
    for (let z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }

  maxSelectFile = (event) => {
    let files = event.target.files
    if (files.length > 1) {
      const msg = 'Only 1 csv file can be uploaded at a time'
      event.target.value = null
      toast.warn(msg)
      return false;
    }
    return true;
  }

  checkFileSize = (event) => {
    let files = event.target.files
    let size = 2000000
    let err = [];
    for (let x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + 'is too large, please pick a smaller file\n';
      }
    };
    for (let z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }
  onChangeHandler = event => {
    var files = event.target.files
    // console.info("onChangeHandler:Files is OK", files)
    if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
      // if return true allow to setState
      console.info("onChangeHandler:MimeTypes is OK")
      this.setState({
        selectedFile: files,
        loaded: 0
      })
    }
  }
  onClickHandler = () => {
    const { props: { dispatch }, state: { selectedFile } } = this;
    // console.info("onClickHandler:selectedFile", selectedFile)
    const dataFile = new FormData();
    // console.info("onClickHandler:dataFile:", dataFile)
    for (let x = 0; x < selectedFile.length; x++) {
      dataFile.append('file', selectedFile[x])
    }
    const loadProgress = {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
        })
      }
    }

    dispatch(uploadFile(dataFile, loadProgress, toast))

  }

  render() {
    const { props: { logs }, state: { selectedFile, loaded } } = this,
      { transactions: { data, tabHeaders } } = logs,
      disable = R.anyPass([R.isNil, R.isEmpty])(selectedFile);

    let output;

    if (logs.transactions.status === STATUS.SUCCESS) {
      if (data.length) {
        output = (
          // <LogGrid data-type={query} data-testid="LogGrid">
          <DataGrid
            id="gridContainer"
            dataSource={data}
            keyExpr="id"
            width={500}
            showBorders={true}
          >
            <Selection mode="single" />
            <Paging defaultPageSize={10} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[5, 10, 20]}
              showInfo={true}
            />
            <Column
              dataField={tabHeaders[0]}
              width={30}
              caption="id"
            />
            <Column dataField={tabHeaders[1]} width={200} />
            <Column dataField={tabHeaders[2]} width={140} dataType={'date'} format={'yyyy-MM-dd hh:mm'} />
            <Column dataField={tabHeaders[3]} alignment="right" format="currency" />
            <Summary>
              <TotalItem
                column={tabHeaders[1]}
                summaryType="count"
                alignment="left" />
              <TotalItem
                column={tabHeaders[3]}
                summaryType="avg"
                alignment="right"
              />
              <TotalItem
                column={tabHeaders[3]}
                summaryType="sum"
                alignment="right"
                valueFormat="currency"
              />
            </Summary>
          </DataGrid>
          // </LogGrid>
        );
      } else {
        output = <h3>Nothing found</h3>;
      }
    } else {
      output = <Loader block />;
    }

    return (
      <div key="Log" data-testid="LogWrapper">
        <Flex justifyContent="center">
          {output}
        </Flex>
         <Flex>
          <div className="row" style={{
            margin: '3em auto'
          }}>
            <div className="offset-md-3 col-md-6">
              <div className="form-group files">
                <label>Upload Your Single CSV-File </label>
                <input type="file" className="form-control" multiple onChange={this.onChangeHandler} />
              </div>
              <div className="form-group">
                <ToastContainer />
                <Progress max="100" color="success" value={loaded} >{Math.round(loaded, 2)}%</Progress>

              </div>
              <Button
               disabled={disable}
                animate={!disable && !!loaded}
                bordered={disable}
                size="sm"
                onClick={this.onClickHandler}
              >
                Upload
            </Button>
            </div>
          </div>
        </Flex>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return { logs: state.logs };
}

export default connect(mapStateToProps)(Log);

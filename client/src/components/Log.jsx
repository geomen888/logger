import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import treeChanges from 'tree-changes';
import { appColor } from 'modules/theme';
import { getTrans, showAlert, switchMenu } from 'actions';
import { STATUS } from 'constants/index';

import {
  ButtonGroup,
  Button,
  Flex,
  Heading,
  Link,
  Image,
  Paragraph,
  theme,
  utils,
} from 'styled-minimal';
import DataGrid, {
  Column,
  Selection,
  Summary,
  TotalItem
} from "devextreme-react/data-grid";
import Loader from 'components/Loader';

const { responsive, spacer } = utils;
const { grays } = theme;

const LogGrid = styled.ul`
  display: grid;
  grid-auto-flow: row;
  grid-gap: ${spacer(2)};
  grid-template-columns: 100%;
  list-style: none;
  margin: ${spacer(4)} auto 0;
  padding: 0;
  /* stylelint-disable */
  ${/* istanbul ignore next */ p =>
    responsive({
      ix: `
        grid-gap: ${spacer(3)(p)};
        width: 90%;
      `,
      md: `
        grid-template-columns: repeat(2, 1fr);
        width: 100%;
      `,
      lg: `
        grid-template-columns: repeat(3, 1fr);
      `,
      xl: `
        grid-gap: ${spacer(4)(p)};
        grid-template-columns: repeat(4, 1fr);
      `,
    })};
  /* stylelint-enable */

  > li {
    display: flex;
  }
`;

const Item = styled(Link)`
  align-items: center;
  border: solid 0.1rem ${appColor};
  border-radius: 0.4rem;
  overflow: hidden;
  padding: ${spacer(3)};
  text-align: center;
  width: 100%;
  /* stylelint-disable */
  ${/* istanbul ignore next */ p =>
    responsive({
      md: `
        padding: ${spacer(3)(p)};
      `,
      lg: `
        padding: ${spacer(4)(p)};
      `,
    })};
  /* stylelint-enable */

  p {
    color: #000;
  }

  img {
    height: 8rem;
    margin-bottom: ${spacer(2)};
  }
`;

const ItemHeader = styled.div`
  margin-bottom: ${spacer(3)};

  small {
    color: ${grays.gray60};
  }
`;

export class Log extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: 'react',
    };
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    logs: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { query } = this.state;
    const { dispatch } = this.props;

   dispatch(getTrans(query));
  }

  componentDidUpdate(prevProps) {
    const { dispatch, logs } = this.props;
    const { changedTo } = treeChanges(prevProps, this.props);

    if (changedTo('logs.transactions.status', STATUS.ERROR)) {
      dispatch(showAlert(logs.transaction.message, { variant: 'danger' }));
    }
  }

  handleClick = e => {
    const { query } = e.currentTarget.dataset;
    const { dispatch } = this.props;

    this.setState({
      query,
    });

    dispatch(switchMenu(query));
  };

  render() {
    const { props: { logs  }, state: { query } } = this,
    { transactions: { data,  tabHeaders } } = logs;
    
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
          <Column
            dataField={tabHeaders[0]}
            width={30}
            caption="id"
          />
          <Column dataField={tabHeaders[1]} width={200}  />
          <Column dataField={tabHeaders[2]} width={140} dataType="date" />
          <Column dataField={tabHeaders[3]} alignment="right" format="currency" />
          <Summary>
            <TotalItem
             column={tabHeaders[1]}
             summaryType="count"
             alignment="left"/>
            <TotalItem
              column={tabHeaders[3]}
              summaryType="avg"
              alignment="right"
              customizeText={this.customizeDate}
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
          {/* <ButtonGroup role="group" aria-label="Log Selector" data-testid="LogSelector">
            <Button
              animate={query === 'react' && logs.transactions.status === 'running'}
              bordered={query !== 'react'}
              size="lg"
              data-query="react"
              onClick={this.handleClick}
            >
              React
            </Button>
            <Button
              animate={query === 'redux' && logs.transactions.status === 'running'}
              bordered={query !== 'redux'}
              size="lg"
              data-query="redux"
              onClick={this.handleClick}
            >
              Redux
            </Button> 
            
          </ButtonGroup>*/}
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

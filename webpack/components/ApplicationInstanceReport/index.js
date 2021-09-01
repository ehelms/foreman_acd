import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './ApplicationInstanceReport.scss';
import ApplicationInstanceReport from './ApplicationInstanceReport';
import * as ApplicationInstanceReportActions from './ApplicationInstanceReportActions';

import {
  selectHosts,
  selectActiveHostId,
  selectDeploymentState,
} from './ApplicationInstanceReportSelectors';

const mapStateToProps = state => ({
  hosts: selectHosts(state),
  activeHostId: selectActiveHostId(state),
  deploymentState: selectDeploymentState(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ApplicationInstanceReportActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationInstanceReport);


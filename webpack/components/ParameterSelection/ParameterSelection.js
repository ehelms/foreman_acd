import React from 'react';
import JSONTree from 'react-json-tree';
import PropTypes from 'prop-types';
import * as sort from 'sortabular';
import { compose } from 'recompose';
import * as resolve from 'table-resolver';
import Select from 'foremanReact/components/common/forms/Select';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
  orderBy
} from 'lodash';

import {
  Icon,
  Button,
  Table,
  FormControl,
  defaultSortingOrder,
  customHeaderFormattersDefinition,
  inlineEditFormatterFactory,
} from 'patternfly-react';

const theme = {
  scheme: 'foreman',
  backgroundColor: 'rgba(0, 0, 0, 255)',
  base00: 'rgba(0, 0, 0, 0)',
};

class ParameterSelection extends React.Component {
  constructor(props) {
    super(props);

    const {
      deleteParameter,
      activateEditParameter,
      changeEditParameter,
    } = this.props;

    const inlineEditController = {
      isEditing: ({ rowData }) => rowData.backup !== undefined,
      onConfirm: ({ rowData }) => {
        const rows = cloneDeep(this.props.rows);
        const index = findIndex(rows, { id: rowData.id });

        delete rows[index].backup;
        delete rows[index].newEntry;

        this.setState({ rows, editing: false,  sortingDisabled: false });
      },
      onCancel: ({ rowData }) => {
        const rows = cloneDeep(this.props.rows);
        const index = findIndex(rows, { id: rowData.id });

        rows[index] = cloneDeep(rows[index].backup);
        delete rows[index].backup;

        if (rows[index].newEntry === true) {
          rows.splice(index, 1);
        }

        this.setState({ rows, editing: false,  sortingDisabled: false });
      },
      onChange: (value, { rowData, property }) => {
        const rows = cloneDeep(this.props.rows);
        const index = findIndex(rows, { id: rowData.id });

        rows[index][property] = value;

        this.setState({ rows });
      },
      onAddEntry: () => {
        const rows = cloneDeep(this.props.rows);
        const index = findLastIndex(rows, 'id') + 1;

        const newRow = {id: index+1, name: "", description: '', type: '', value: '', newEntry: true };
        rows.push(newRow);
        rows[index].backup = cloneDeep(rows[index]);

        this.setState({ rows, editing: true, sortingDisabled: true });
      }
    };
    this.inlineEditController = inlineEditController;

    // enables our custom header formatters extensions to reactabular
    this.customHeaderFormatters = customHeaderFormattersDefinition;

    const inlineEditButtonsFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.props.editing,
      renderValue: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button
            bsStyle="default"
            onClick={() => activateEditParameter(additionalData)}
          >
            <Icon type="pf" name="edit" />
          </Button>
          &nbsp;

          <Button
            bsStyle="default"
            onClick={() => window.confirm("Are you sure you wish to delete this item?") && deleteParameter(additionalData)}
          >
            <Icon type="pf" name="delete" />
          </Button>
        </td>
      ),
      renderEdit: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button bsStyle="default" disabled>
            <Icon type="pf" name="edit" />
          </Button>
        </td>
      )
    });
    this.inlineEditButtonsFormatter = inlineEditButtonsFormatter;

    // Point the transform to your sortingColumns. React state can work for this purpose
    // but you can use a state manager as well.
    const getSortingColumns = () => this.props.sortingColumns || {};

    const sortableTransform = sort.sort({
      getSortingColumns,
      onSort: selectedColumn => {
        this.setState({
          sortingColumns: sort.byColumn({
            sortingColumns: this.props.sortingColumns,
            sortingOrder: defaultSortingOrder,
            selectedColumn
          })
        });
      },
      // Use property or index dependening on the sortingColumns structure specified
      strategy: sort.strategies.byProperty
    });
    this.sortableTransform = sortableTransform;

    const sortingFormatter = sort.header({
      sortableTransform,
      getSortingColumns,
      strategy: sort.strategies.byProperty
    });
    this.sortingFormatter = sortingFormatter;

    const inlineEditFormatterImpl = {
      renderValue: (value, additionalData) => (
        <td>
          <span className="static">{value}</span>
        </td>
      ),
      renderEditText: (value, additionalData, subtype='text') => (
        <td className="editing">
          <FormControl
            type={subtype}
            defaultValue={value}
            onBlur={e => changeEditParameter(e.target.value, additionalData) }
          />
        </td>
      ),
      renderEditSelect: (value, additionalData, options) => (
        <td className="editing">
          <Select
            value={value}
            onChange={e => changeEditParameter(e.target.value, additionalData) }
            options={options}
            allowClear
            key="key"
          />
        </td>
      ),
    };

    const inlineEditFormatter = inlineEditFormatterFactory({
      isEditing: additionalData =>
        inlineEditController.isEditing(additionalData),
      renderValue: (value, additionalData) => (
        inlineEditFormatterImpl.renderValue(value, additionalData)
      ),
      renderEdit: (value, additionalData) => {
        switch (additionalData.property) {
          case 'type':
            if (additionalData.rowData.newEntry === true) {
              return inlineEditFormatterImpl.renderEditSelect(value, additionalData, {
                ip: 'IP',
                hostname: 'Hostname',
                password: 'Root password',
                lifecycleenv: 'Lifecycle environment',
                puppetenv: 'Puppet environment',
                hostparam: 'Host parameter',
              })
            }
            return inlineEditFormatterImpl.renderValue(value, additionalData)
          case 'value':
            switch (additionalData.rowData.type) {
              case 'ip':
                return inlineEditFormatterImpl.renderEditText(value, additionalData)
              case 'hostname':
                return inlineEditFormatterImpl.renderEditText(value, additionalData)
              case 'password':
                return inlineEditFormatterImpl.renderEditText(value, additionalData, 'password')
              case 'puppetenv':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, this.props.puppetEnv)
              case 'lifecycleenv':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, this.props.lifecycleEnv)
              case 'text':
              default:
                return inlineEditFormatterImpl.renderEditText(value, additionalData);
            }
          default:
            return inlineEditFormatterImpl.renderEditText(value, additionalData)
        }
      }
    });
    this.inlineEditFormatter = inlineEditFormatter;
  }

  componentDidMount() {
    const {
      data: { puppetEnvUrl, lifecycleEnvUrl, lifecycleEnvOrganization, parameters },
      initParameterSelection,
    } = this.props;

    this.props.getPuppetEnvironments(
      puppetEnvUrl,
      { page: 1, perPage: 1000 },
      {}
    );

    this.props.getLifecycleEnvironments(
      lifecycleEnvUrl,
      lifecycleEnvOrganization,
      { page: 1, perPage: 1000 },
      {}
    );

    initParameterSelection(
      parameters,
      this.inlineEditController,
      this.sortingFormatter,
      this.sortableTransform,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter,
    );
  }

  render() {
    const { rows, sortingColumns, columns, sortingDisabled } = this.props;

    const {
      loading,
      definition,
      puppetEnv,
      lifecycleEnv,
      addParameter,
      confirmEditParameter,
      cancelEditParameter,
    } = this.props;

    var sortedRows;
    if (sortingDisabled === false) {
      sortedRows = compose(
        sort.sorter({
          columns,
          sortingColumns,
          sort: orderBy,
          strategy: sort.strategies.byProperty
        })
      )(rows);
    } else {
     sortedRows = rows;
    }

    return(
      <div>
        <div>
          <Button bsStyle="default" onClick={() => addParaemter()}>
            <Icon type="fa" name="plus" />
          </Button>
          <Table.PfProvider
            striped
            bordered
            hover
            dataTable
            inlineEdit
            columns={columns}
            components={{
              header: {
                cell: cellProps =>
                  this.customHeaderFormatters({
                    cellProps,
                    columns,
                    sortingColumns
                  })
              },
              body: {
                row: Table.InlineEditRow,
                cell: cellProps => cellProps.children
              }
            }}
          >
            <Table.Header headerRows={resolve.headerRows({ columns })} />
            <Table.Body
              rows={sortedRows}
              rowKey="id"
              onRow={(rowData, { rowIndex }) => ({
                role: 'row',
                isEditing: () => this.inlineEditController.isEditing({ rowData }),
                onCancel: () => cancelEditParameter({ rowData, rowIndex }),
                onConfirm: () => confirmEditParameter({ rowData, rowIndex }),
                last: rowIndex === sortedRows.length - 1
              })}
            />
          </Table.PfProvider>
          <Button bsStyle="default" onClick={() => addParameter()}>
            <Icon type="fa" name="plus" />
          </Button>
        </div>
      </div>
    );
  }
}

ParameterSelection.defaultProps = {
  error: {},
  loading: false,
  definition: true,
  puppetEnv: [],
  lifecycleEnv: [],
  rows: [],
  sortingColumns: {},
  columns: [],
  sortingDisabled: false,
};

ParameterSelection.propTypes = {
  data: PropTypes.shape({
    definition: PropTypes.bool.isRequired,
    puppetEnvUrl: PropTypes.string.isRequired,
    lifecycleEnvUrl: PropTypes.string.isRequired,
    lifecycleEnvOrganization: PropTypes.string.isRequired,
    parameters: PropTypes.array.isRequired,
  }).isRequired,
  getPuppetEnvironments: PropTypes.func,
  getLifecycleEnvironments: PropTypes.func,
  initParameterSelection: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  definition: PropTypes.bool.isRequired,
  puppetEnv: PropTypes.array.isRequired,
  lifecycleEnv: PropTypes.array.isRequired,
  rows: PropTypes.array,
  sortingColumns: PropTypes.object,
  columns: PropTypes.array,
  sortingDisabled: PropTypes.bool,
  deleteParameter: PropTypes.func,
  activateEditParameter: PropTypes.func,
  confirmEditParameter: PropTypes.func,
  cancelEditParameter: PropTypes.func,
  changeEditParameter: PropTypes.func,
};

export default ParameterSelection;

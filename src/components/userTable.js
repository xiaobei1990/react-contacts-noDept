// eslint-disable-next-line
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {Table, Radio, Badge, Input, Button, Space, Tooltip} from 'antd';
import { FilterFilled, SearchOutlined} from '@ant-design/icons';
import styles from './contacts.less';
import {useMemoizedFn} from "ahooks";

function stateToLabel(val, zhIntl) {
  let color = '';
  let state = '';
  switch (Number(val)) {
    case 0:
      color = 'success';
      state = zhIntl('正常');
      break;
    case 1:
      color = 'error';
      state = (
        <span style={{ color: 'red' }}>
            {zhIntl('已鎖定')}
          </span>
      );
      break;
    case 2:
      color = 'warning';
      state = zhIntl('未激活')
      break;
    case 9:
      color = 'error';
      state = (
        <span style={{ color: 'red' }}>
            {zhIntl('已禁用')}
          </span>
      );
      break;
    default:
      color = 'warning';
      state = zhIntl('未知')
      break;
  }
  return <Badge status={color} text={state} />;
};

export default ({
                  users, searchResult,  defaultUserSelected,
                  handleSearch, debug = false, selectUser, setSelectUser,
                  locale, zhIntl, onSearch, multiple,
                  searchData, searchTitle, resetTitle
                }) => {

  const [tableSearchData, setSearchData] = useState({
    current: 1,
    size: 10
  });

  const [userData, setUserData] = useState({records: []});
//  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (onSearch) {
      setUserData(searchResult);
    } else {
      setUserData(users);
    }
  }, [users, searchResult, onSearch])

  // 当选中人数据发生变化，重新计算全选
  // useEffect(() => {
  //   calculateSelectAll(selectUser);
  // }, [ selectUser ]);
  //

  /**
   * 计算是否全部选中
   * @param newSelectUser
   */
  // const calculateSelectAll = useCallback((newSelectUser) => {
  //   let tmp = [];
  //   console.log(disableUsers, "+== console.log(disableUsers)=");
  //   userData?.records?.forEach((value) => {
  //     if (!disableUsers.includes(value.userId)) {
  //       tmp.push(value);
  //     }
  //   });
  //   if (tmp.length === 0) {
  //     setSelectAll(false);
  //     return;
  //   }
  //   let count = 0;
  //   tmp.forEach((val) => {
  //     const result = newSelectUser.find(
  //         (valUser) => val.userId === valUser.userId
  //     );
  //     if (result) {
  //       count += 1;
  //     }
  //   });
  //   setSelectAll(count === tmp.length);
  // },[disableUsers, userData?.records]);

  const getColumnSearchProps = useMemoizedFn((key, placeholder) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          placeholder={placeholder}
          value={tableSearchData[key] || ''}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            let obj = {...tableSearchData};
            obj[key] = e.target.value;
            setSearchData(obj);
          }}
          onPressEnter={() => confirm()}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            onClick={() => {
              clearFilters && clearFilters();
              let obj = {...tableSearchData};
              obj[key] = undefined;
              setSearchData(obj);
            }}
            size="small"
          >
            {resetTitle}
          </Button>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
          >
            {searchTitle}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => {
      return <SearchOutlined
        style={{
          color: filtered ? 'var(--primary-color)' : undefined,
        }}
      />
    },
    filteredValue: JSON.stringify(tableSearchData?.[key]) !== undefined ? [tableSearchData?.[key]] : null,
    onFilterDropdownVisibleChange: (visible) => {
      if(!visible){
        window.console.log(searchData, tableSearchData, '444444')
        if(JSON.stringify(searchData) !== JSON.stringify(tableSearchData)){
          handleStandardTableChange();
        }
      }
    },
  }));

  const getColumnSelectProps = useMemoizedFn((key, option) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
        key={key}
      >
        <Radio.Group
          value={tableSearchData[key]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            let obj = {...tableSearchData};
            obj[key] = e.target.value;
            setSearchData(obj);
          }}
        >
          <Space direction="vertical" style={{marginBottom: '8px'}}>
            {option?.length>0 && option.map( radio => {
              return <Radio value={radio.value}>{radio.label}</Radio>
            })}
          </Space>
        </Radio.Group>
        <Space style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            onClick={() => {
              clearFilters && clearFilters();
              let obj = {...tableSearchData};
              obj[key] = undefined;
              setSearchData(obj);
            }}
            size="small"
          >
            {resetTitle}
          </Button>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
          >
            {searchTitle}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => {
      return  <FilterFilled
        style={{
          color: filtered ? 'var(--primary-color)' : undefined,
        }}
      />
    },
    filteredValue: JSON.stringify(tableSearchData?.[key]) !== undefined ? [tableSearchData?.[key]] : null,
    onFilterDropdownVisibleChange: (visible) => {
      if(!visible){
        if(JSON.stringify(searchData) !== JSON.stringify(tableSearchData)){
          handleStandardTableChange();
        }
      }
    },
  }));

  const columns = useMemo(()=>{
    return [
      {
        title: zhIntl('姓名'),
        fixed: 'left',
        dataIndex: 'realName',
        kye: 'realName',
        ...getColumnSearchProps('realName', zhIntl('请输入姓名')),
      },
      {
        title: zhIntl('手机号'),
        dataIndex: 'phone',
        key: 'phone',
        ...getColumnSearchProps('phone', zhIntl('请输入手机号')),
      },
      {
        title: zhIntl('账号'),
        dataIndex: 'username',
        key: 'username',
        ...getColumnSearchProps('username', zhIntl('请输入账号')),
      },
      {
        title: zhIntl('部门'),
        dataIndex: 'deptPathName',
        key: 'deptPathName',
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
        ),
      },
      {
        title: zhIntl('角色'),
        dataIndex: 'roleList',
        key: 'roleList',
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          let showRole = '';
          if(record?.roleList?.length > 0){
            showRole = record?.roleList?.map( role => {
              let roleName = role.roleName;
              if (locale === 'zh-TW' || locale === 'zh-HK') {
                roleName = role.roleNameTw || role.roleName;
              } else if (locale === 'en-US') {
                roleName = role.roleNameEn || role.roleName;
              }
              return roleName
            }).join('; ');
          }
          if(showRole){
            return <Tooltip placement="topLeft" title={showRole}>
              {showRole}
            </Tooltip>
          }
        },
      },
      {
        title: zhIntl('状态'),
        dataIndex: 'lockFlag',
        key: 'lockFlag',
        width: 120,
        render: (val) => <span>{stateToLabel(val, zhIntl)}</span>,
        ...getColumnSelectProps('lockFlag', [
          {
            label: zhIntl('正常'),
            value: 0,
          },
          {
            label: zhIntl('未激活'),
            value: 2,
          },
          {
            label: zhIntl('已禁用'),
            value: 9,
          },
        ]),
      },
    ]
  }, [tableSearchData])

  const handleStandardTableChange = (pagination) => {
    const params = {
      ...tableSearchData,
      current: pagination?.current || 1,
      size: pagination?.pageSize || 10,
    };
    handleSearch(params);
  };

  const onSelect = useMemoizedFn((record, selected) => {
    if (multiple) {
      if (selected) {
        setSelectUser((rows) => [...rows, record]);
      } else {
        setSelectUser((rows) => rows.filter((row) => row?.userId !== record?.userId));
      }
    } else {
      setSelectUser([record]);
    }
  });
  const onSelectAll = useMemoizedFn((selected, selectedRows, changeRows) => {
    if (selected) {
      setSelectUser((rows) => [...rows, ...changeRows]);
    } else {
      setSelectUser((rows) =>
        rows.filter((row) => !changeRows?.some((sr) => sr?.userId === row?.userId)),
      );
    }
  });

  return (
      <Table
          className={styles.tableClass}
          rowSelection={{
            type: multiple ? 'checkbox' : 'radio',
            selectUser,
            selectedRowKeys: selectUser?.map?.((item) => item.userId) || [],
            onSelect,
            onSelectAll,
            getCheckboxProps: (record) => ({
              //  disabled: defaultUserSelected?.some?.((selected) => selected?.userId === record?.userId) || false,
            }),
          }}
          rowKey={(record) => record.userId}
       //   loading={loading}
          rowClassName={(record) => {
            let classname = '';
            if (record.ord < 0) classname = styles['table-color-dust'];

            return classname;
          }}
          dataSource={userData?.records || []}
          columns={columns}
          onChange={handleStandardTableChange}
          pagination={{
            current: userData?.current || 1,
            pageSize: userData?.size || 10,
            total: userData?.total || 0,
          }}
      />
  )
}

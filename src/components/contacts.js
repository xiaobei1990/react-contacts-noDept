import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Spin,
  message,
  Typography
} from 'antd';

import Search from './Search';
import styles from './contacts.less';
import UserTable from "./userTable";


const Contacts = (props) => {

  const {
    users,
    loading = false,
    searchResult,
    userSearch = false,
    totalShowText, handleSearchUser, updateSelectUsers, defaultUserSelected,
    selectAllText, locale, deptTitle,
    roleTitle, multiple,
    deptTree, searchData, roleList, deptPlaceholder, notFoundContent, rolePlaceholder, searchTitle, resetTitle,zhIntl,
    allUserList, handleAllUser, fromByLogin
  } = props;


  const [selectUser, setSelectUser] = useState([]);
  const [onSearch, setOnSearch] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [searchDataCur, setSearchDataCur] = useState({
    current: 1,
    size: 10
  });

  useEffect(()=>{
    if(selectAll && allUserList?.length > 0){
      setSelectUser(allUserList);
      updateSelectUsers(allUserList);
    }
  }, [allUserList])

  useEffect(()=>{
    updateSelectUsers(selectUser);
  }, [selectUser])

  useEffect(()=>{
    const selectedRows = defaultUserSelected?.map(item => {
      return {userId: item.userId}
    });
    window.console.log(selectedRows, 'defaultUserSelected')
    setSelectUser(selectedRows);
  }, [defaultUserSelected])

  /**
   *  点击查询回调，会把查询信息回传，外部调用查询用
   * @param nameKey 名字搜索关键字
   * @param deptId 部门id
   */
  const handleSearch = (searchInfo) => {
    if (handleSearchUser) {
      setOnSearch(true);
      setSearchDataCur(Object.assign({}, searchDataCur, searchInfo));
      handleSearchUser(Object.assign({}, searchDataCur, searchInfo));
    } else {
      message.error('search function not found.');
    }
  };

  const makeShowMsg = useMemo(() => {
    const tmp = totalShowText.split("$");
    let font = "";
    let end = "";
    if (tmp.length === 2) {
      font = tmp[0];
      end = tmp[1];
    } else {
      font = totalShowText;
    }
    let length = 0;
    length = selectUser?.length || 0;

    if(length === 0){
      setSelectAll(false);
    }

    return (
      <div>
        {font} <span className={styles.number}>{length}</span> {end}
      </div>
    );
  }, [selectUser?.length])

  return (
    <div style={{ height: '100%' }}>
      <Spin spinning={loading}>
        <div style={{ marginBottom: 24 }}>
          <Search
              allDeptTree={deptTree}
              roles={roleList}
              loading={loading}
              handleSearch={handleSearch}
              deptPlaceholder={deptPlaceholder}
              notFoundContent={notFoundContent}
              rolePlaceholder={rolePlaceholder}
              searchTitle={searchTitle}
              resetTitle={resetTitle}
              deptTitle={deptTitle}
              roleTitle={roleTitle}
              />
          {multiple && <div className={styles.selectAll}>
            <Typography.Link
              type="link"
              style={{color: selectAll ? '#FF6D6A' : ''}}
              onClick={() => {
                if(!selectAll && handleAllUser){
                  handleAllUser(searchDataCur);
                } else if(selectAll) {
                  setSelectUser([]);
                }
                setSelectAll(!selectAll);
              }}
            >{!selectAll ? selectAllText : '取消'}</Typography.Link>
            {makeShowMsg}
          </div>}
          <UserTable
              loading={loading}
              handleSearch={handleSearch}
              notFoundContent={notFoundContent}
              searchTitle={searchTitle}
              resetTitle={resetTitle}
              zhIntl={zhIntl}
              selectUser={selectUser}
              setSelectUser={setSelectUser}
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              users={users}
              searchResult={searchResult}
              onSearch={onSearch}
              multiple={multiple}
              searchData={searchDataCur}
              defaultUserSelected={defaultUserSelected}
              fromByLogin={fromByLogin}
          />
        </div>
      </Spin>
    </div>
  )

};

Contacts.propTypes = {
  deptTree: PropTypes.array.isRequired, //部门树
  roleList: PropTypes.array.isRequired, //角色list
  users: PropTypes.object, // 用户数据，翻页查询
  loading: PropTypes.bool,
  searchResult: PropTypes.object, // 查询条件
  handleSearchUser: PropTypes.func.isRequired,
  updateSelectUsers: PropTypes.func.isRequired,
  updateSelectDept: PropTypes.func.isRequired,
  deptTitle: PropTypes.string, // 部门过滤label
  roleTitle: PropTypes.string, // 角色过滤label
  notFoundContent:  PropTypes.string, // 无数据提示
  deptSelectPlaceholder: PropTypes.string, // 部门选择Placeholder
  rolePlaceholder: PropTypes.string, // 角色选择Placeholder
  searchTitle: PropTypes.string, // 查询按钮
  resetTitle: PropTypes.string, // 重置按钮
  defaultUserSelected: PropTypes.array,
  debug: PropTypes.bool,
  selectAllText: PropTypes.string,
  totalShowText: PropTypes.string,
  radio: PropTypes.bool,
  radioShowText: PropTypes.string,
  // 返回精简节点，如果为true，只返回精简的节点，比如子节点全部选中，只返回父节点一个node
  returnReducedNode:PropTypes.bool,
  locale:  PropTypes.string, // 系统/用户语言
  zhIntl: PropTypes.func, // 国际化方法
  multiple: PropTypes.bool, // 是否多选
  allUserList: PropTypes.array, // 全选的数据
  handleAllUser: PropTypes.func.isRequired, //全选事件
  fromByLogin: PropTypes.string, //登录来源，cloud为云服务
};

Contacts.defaultProps = {
  users: {
    records: [],
  },
  loading: false,
  searchResult: {
    records: [],
  },
  deptTitle: '部门',
  roleTitle: '角色',
  deptPlaceholder: '请选择部门',
  notFoundContent: '',
  rolePlaceholder: '请选择角色',
  searchTitle: '查询',
  resetTitle: '重置',
  defaultUserSelected: [],
  debug: false,
  selectAllText: '全选',
  totalShowText: '共选择了$个',
  radio: false,
  radioShowText: '已经选择',
  returnReducedNode:false,
  // 隐藏右边选人部分
  hideRight:false,
  locale: 'zh-CN',
  multiple: true,
  zhIntl: (res) => {return res},
  allUserList: [], // 全选的数据
  fromByLogin: sessionStorage.getItem('from'),
};

export default Contacts;

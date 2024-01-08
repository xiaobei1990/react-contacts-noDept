// eslint-disable-next-line
import React, { useState } from 'react';
import {Row, TreeSelect, Col, Select, Form, Button, Space} from 'antd';

function onTreeSelectData(data) {
    if (!data || (data && data.length === 0)) {
        return null;
    }
    return data.map((item) => {
        if (item.children) {
            return (
                <TreeSelect.TreeNode title={item.name} key={item.id} value={String(item.id)} obj={item}>
                    {onTreeSelectData(item.children)}
                </TreeSelect.TreeNode>
            );
        }
        return <TreeSelect.TreeNode title={item.name} key={item.id} value={String(item.id)} obj={item} />;
    });
};

export default (props) => {

    const [form] = Form.useForm();

    const { allDeptTree, roles,
        loading, handleSearch, deptPlaceholder, notFoundContent, rolePlaceholder,
        searchTitle, resetTitle, locale, deptTitle, roleTitle } = props;
    const [deptId, setDeptIds] = useState(undefined);
    const [roleId, setRoleIds] = useState(undefined);

    const okHandle = () => {
        const payloadData = {
            roleId:roleId?.join(','),
            deptId:deptId?.join(','),
            current: 1,
            size: 10,
        };
      handleSearch(payloadData);
    };

    const reset = () => {
        setDeptIds(undefined);
        setRoleIds(undefined);
        form.resetFields();
        const resetData = {
            current: 1,
            size: 10,
            deptId: undefined,
            roleId: undefined,
        };
      handleSearch(resetData);
    };

    return <Form style={{marginBottom: '-12px'}} form={form}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col flex={1}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{padding: '0 12px'}}>
              <Form.Item
                label={deptTitle}
                name="deptId"
              >
                <TreeSelect
                  style={{width: '100%'}}
                  placeholder={deptPlaceholder}
                  notFoundContent={notFoundContent}
                  dropdownMatchSelectWidth={false}
                  treeCheckable={true}
                  treeCheckStrictly={true}
                  showCheckedStrategy="SHOW_ALL"
                  onChange={(value) => {
                    setDeptIds(value?.map( dept => dept.value));
                  }}
                  treeDefaultExpandedKeys={allDeptTree?.length>0 && allDeptTree.map( v=> v.id ) || []}
                  filterTreeNode={(inputValue, treeNode) => {
                    return (
                      treeNode?.props?.[
                      typeof treeNode?.props?.title === 'string' && 'title'
                        ]
                        ?.toLowerCase()
                        .indexOf(inputValue.toLowerCase()) >= 0
                    );
                  }}
                >
                  {onTreeSelectData(allDeptTree)}
                </TreeSelect>
              </Form.Item>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{padding: '0 12px'}}>
              <Form.Item
                label={roleTitle}
                name="roleId"
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder={rolePlaceholder}
                  style={{ width: '100%' }}
                  mode="multiple"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  onChange={(value) => {
                    setRoleIds(value);
                  }}
                >
                  {roles &&
                    roles.map((v) => {
                      let showRole = v.roleName;
                      if (locale === 'zh-TW' || locale === 'zh-HK') {
                        showRole = v.roleNameTw || v.roleName;
                      } else if (locale === 'en-US') {
                        showRole = v.roleNameEn || v.roleName;
                      } else if (locale === 'zh-CN') {
                        showRole = v.roleName;
                      }
                      return (
                        <Select.Option key={v.roleId} value={v.roleId} lable={showRole}>
                          {showRole}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              onClick={okHandle}
              loading={loading}
            >
              {searchTitle}
            </Button>
            <Button onClick={reset}>
              {resetTitle}
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
}

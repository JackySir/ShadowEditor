/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { classNames, PropTypes } from '../../third_party';
import { SearchField, ImageList } from '../../ui/index';
import EditWindow from './window/EditWindow.jsx';
import Ajax from '../../utils/Ajax';
import global from '../../global';

/**
 * 预设体面板
 * @author tengge / https://github.com/tengge1
 */
class PrefabPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            categoryData: [],
            name: '',
            categories: []
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.update = this.update.bind(this);
    }

    render() {
        const { className, style } = this.props;
        const { data, categoryData, name, categories } = this.state;
        const { enableAuthority, authorities } = global.app.server;

        let list = data;

        if (name.trim() !== '') {
            list = list.filter(n => {
                return n.Name.toLowerCase().indexOf(name.toLowerCase()) > -1 ||
                    n.FirstPinYin.toLowerCase().indexOf(name.toLowerCase()) > -1 ||
                    n.TotalPinYin.toLowerCase().indexOf(name.toLowerCase()) > -1;
            });
        }

        if (categories.length > 0) {
            list = list.filter(n => {
                return categories.indexOf(n.CategoryID) > -1;
            });
        }

        const imageListData = list.map(n => {
            return Object.assign({}, n, {
                id: n.ID,
                src: n.Thumbnail ? `${global.app.options.server}${n.Thumbnail}` : null,
                title: n.Name,
                icon: 'model',
                cornerText: n.Type
            });
        });

        return <div className={classNames('PrefabPanel', className)}
            style={style}
               >
            <SearchField
                data={categoryData}
                placeholder={_t('Search Content')}
                showFilterButton
                onInput={this.handleSearch.bind(this)}
            />
            <ImageList
                data={imageListData}
                showEditButton={!enableAuthority || authorities.includes('EDIT_PREFAB')}
                showDeleteButton={!enableAuthority || authorities.includes('DELETE_PREFAB')}
                onClick={this.handleClick}
                onEdit={this.handleEdit}
                onDelete={this.handleDelete}
            />
        </div>;
    }

    componentDidUpdate() {
        if (this.init === undefined && this.props.show === true) {
            this.init = true;
            this.update();
        }
    }

    update() {
        fetch(`${global.app.options.server}/api/Category/List?Type=Prefab`).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    global.app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                this.setState({
                    categoryData: obj.Data
                });
            });
        });
        fetch(`${global.app.options.server}/api/Prefab/List`).then(response => {
            response.json().then(obj => {
                if (obj.Code !== 200) {
                    global.app.toast(_t(obj.Msg), 'warn');
                    return;
                }
                this.setState({
                    data: obj.Data
                });
            });
        });
    }

    handleSearch(name, categories) {
        this.setState({
            name,
            categories
        });
    }

    handleClick(data) {
        Ajax.get(`${global.app.options.server}/api/Prefab/Get?ID=${data.ID}`, result => {
            var obj = JSON.parse(result);
            if (obj.Code === 200) {
                //var material = (new MaterialsSerializer()).fromJSON(obj.Data.Data);
                //global.app.call(`selectMaterial`, this, material);
            }
        });
    }

    // ------------------------------- 编辑 ---------------------------------------

    handleEdit(data) {
        var win = global.app.createElement(EditWindow, {
            type: 'Prefab',
            typeName: _t('Prefab'),
            data,
            saveUrl: `${global.app.options.server}/api/Prefab/Edit`,
            callback: this.update
        });

        global.app.addElement(win);
    }

    // ------------------------------ 删除 ----------------------------------------

    handleDelete(data) {
        global.app.confirm({
            title: _t('Confirm'),
            content: `${_t('Delete')} ${data.title}?`,
            onOK: () => {
                fetch(`${global.app.options.server}/api/Prefab/Delete?ID=${data.id}`, {
                    method: 'POST'
                }).then(response => {
                    response.json().then(obj => {
                        if (obj.Code !== 200) {
                            global.app.toast(_t(obj.Msg), 'warn');
                            return;
                        }
                        this.update();
                    });
                });
            }
        });
    }
}

PrefabPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool
};

PrefabPanel.defaultProps = {
    className: null,
    style: null,
    show: false
};

export default PrefabPanel;
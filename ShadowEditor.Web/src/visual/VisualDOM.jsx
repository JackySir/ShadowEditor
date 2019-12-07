/**
 * VisualDOM
 * @author tengge / https://github.com/tengge1
 */
class VisualDOM extends React.Component {
    constructor(props) {
        super(props);

        this.defMap = {};
        this.componentMap = {};

        this.state = {
            defs: [],
            components: []
        };
    }

    render() {
        const { defs, components } = this.state;

        return <svg>
            <defs>{defs}</defs>
            {components}
        </svg>;
    }

    getDef(id) {
        return this.defMap[id] || null;
    }

    get(id) {
        return this.componentMap[id] || null;
    }

    addDef(def, id = null) {
        if (id === null) {
            id = THREE.Math.generateUUID();
        }
        if (this.defMap[id]) {
            console.warn(`VisualDOM: def ${id} is already added.`);
            return;
        }
        this.defMap[id] = def;

        let defs = this.state.defs;
        defs.push(def);

        this.setState({
            defs
        });

        return id;
    }

    removeDef(obj) {
        let defMap = this.defMap;
        let defs = this.state.defs;

        if (obj instanceof React.Component) {
            for (let i in defMap) {
                if (defMap[i] === obj) {
                    delete defMap[i];
                    break;
                }
            }
        } else {
            delete defMap[obj];
        }

        let index = defs.indexOf(obj);
        if (index === -1) {
            return false;
        }
        defs.splice(index, 1);
        this.setState({
            defs
        });
        return true;
    }


    add(component, id = null) {
        if (id === null) {
            id = THREE.Math.generateUUID();
        }
        if (this.componentMap[id]) {
            console.warn(`VisualDOM: component ${id} is already added.`);
            return;
        }
        this.componentMap[id] = component;

        let components = this.state.components;
        components.push(component);

        this.setState({
            components
        });

        return id;
    }

    remove(obj) {
        let componentMap = this.componentMap;
        let components = this.state.components;

        if (obj instanceof React.Component) {
            for (let i in componentMap) {
                if (componentMap[i] === obj) {
                    delete componentMap[i];
                    break;
                }
            }
        } else {
            delete componentMap[obj];
        }

        let index = components.indexOf(obj);
        if (index === -1) {
            return false;
        }
        components.splice(index, 1);
        this.setState({
            components
        });
        return true;
    }
}

export default VisualDOM;
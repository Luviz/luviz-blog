import styles from "../../styles/inputs.module.css";


export function TextField({
    placeholder=undefined,
    onChange=undefined,
    style=undefined,
    value=undefined,
    tabindex=undefined
}) {
    return <input 
        type="text"
        className={styles.textField}
        placeholder={placeholder}
        style={style}
        value={value}
        tabIndex={tabindex}
        onChange={(e) => {
            if (onChange){
                onChange(e.currentTarget.value)
            }
        }}
    />
}
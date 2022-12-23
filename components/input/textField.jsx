import styles from "../../styles/inputs.module.css";


export function TextField({
    placeholder=undefined,
    onChange=undefined,
    style=undefined
}) {
    return <input 
        type="text"
        className={styles.textField}
        placeholder={placeholder}
        style={style}
        onChange={(e) => {
            if (onChange){
                onChange(e.currentTarget.value)
            }
        }}
    />
}
import styles from "../../styles/inputs.module.css";


export function Button({
    value=undefined,
    onClick=undefined
}) {
    return <input 
        type="button"
        className={styles.textField}
        value={value}
        onClick={onClick}
    />
}
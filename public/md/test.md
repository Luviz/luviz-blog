
# Hello world

this some md test

$$
\frac{\sqrt{3}}{3^{12}} = x
$$

## Some JavaScript 

``` js
export default function NavBar() {
    const li = [
        { text: "Home", value: "#" },
        { text: "Blog", value: "#Blog" },
        { text: "About", value: "#About" },
    ].map((l, ix) => <li key={ix}><Link href={l.value} passHref>{l.text}</Link></li>)

    return <nav className={styles.nav}>
        <Link href="/" passHref>
            <img src="/Icon-BJ.svg" alt="Bardia Jedi Logo" className={styles.bannerIcon} />
        </Link>
        <ul>
            {li}
        </ul>
    </nav>
}
```

### about the code 

Quis enim consectetur nobis eos nemo magni. Reiciendis iste et obcaecati doloribus minus odit, eum optio, assumenda nobis, voluptatibus dicta perspiciatis excepturi itaque repellat! Eaque aut tempore dolores saepe minus.

## Some python

``` py 
import panda as pd 

def get_df():
    pd.read_csv('some.csv')

df = get_df()

df.loc[df["col1"] == 12 ]
````

## some img 

cool Python art work!

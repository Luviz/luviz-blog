import Head from 'next/head'
import Image from 'next/image'
import MyApp from './_app'
import styles from '../styles/Home.module.css'
import { NavBar } from "./components"

export default function Home() {
  return (
    <div className={styles.container}>
      <NavBar />
      <main className={styles.main}>
        <div className={styles.content}>
          <h2>hello world</h2>
          <h3>have some content</h3>
          <h4>have some content</h4>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum amet est laudantium excepturi quod, harum rerum voluptatibus facere impedit, voluptate voluptatem, autem exercitationem minus eveniet itaque obcaecati quasi ullam quibusdam?</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius saepe nisi repellat officiis esse eveniet aspernatur ratione voluptatibus, fugit doloribus minima error explicabo asperiores veniam quam odit cum animi placeat.</p>

          <h4>have some other</h4>
          <p>Fugit molestiae, eos sint vel libero consequatur exercitationem repudiandae omnis, saepe sed, voluptas vitae possimus architecto! Sit alias illum voluptatem! Aliquid voluptatibus dolore at. Rem ipsa animi necessitatibus accusamus itaque?</p>
          <p>Similique necessitatibus saepe facere quasi provident repudiandae fugiat, nulla praesentium veritatis, quibusdam deserunt suscipit. Iure veniam officiis sunt dolore explicabo facilis, inventore molestiae fugit labore pariatur! Quisquam dicta et sit?</p>
          <p>Perferendis, voluptatibus. Consequatur fugiat, necessitatibus voluptatem minima aliquam, animi voluptatibus a, rem sequi ducimus magni corrupti consequuntur distinctio quos optio atque cupiditate ex laboriosam officia quia voluptas beatae obcaecati ratione?</p>
          <p>Asperiores exercitationem veritatis perferendis quos aliquam fugiat, excepturi dolore earum ipsa eos maxime voluptate totam pariatur adipisci hic quasi mollitia velit explicabo consequatur corporis facere? Unde eveniet dolores corrupti hic.</p>
          <p>Beatae qui ab officia quia consequuntur eius laborum aut dignissimos, hic exercitationem atque, odit nulla fugiat, porro tempora doloribus natus aliquam obcaecati nisi amet saepe harum. Repudiandae vero fuga eos.</p>
          <p>Sint eligendi amet perferendis doloremque, non quo neque! Similique blanditiis vero ea, officia dolore, in id illum praesentium corrupti perferendis mollitia veniam, libero exercitationem fugit repellendus rem? Incidunt, molestiae nisi.</p>
          <p>Quis enim consectetur nobis eos nemo magni. Reiciendis iste et obcaecati doloribus minus odit, eum optio, assumenda nobis, voluptatibus dicta perspiciatis excepturi itaque repellat! Eaque aut tempore dolores saepe minus.</p>
        </div>

      </main>
    </div>
  )
}

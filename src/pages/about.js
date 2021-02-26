import React from "react";
import "reset-css";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import { sortBy } from "lodash";
import classnames from "classnames";
import Nav from "../components/nav";
import styles from "./about.module.scss";
import Layout from "../components/layout";
import BlacksWhoDesign from "../friends/blackswhodesign.svg";
import LatinxsWhoDesign from "../friends/latinxswhodesign.png";
import PeopleOfCraft from "../friends/peopleofcraft.png";
import QueerDesignClub from "../friends/queerdesignclub.svg";
import UruguayansWhoDesign from "../friends/Uruguayans.svg";
import APIWhoDesign from "../friends/apiwhodesign.svg";
import BraziliansWhoDesign from "../friends/brazilianswhodesign.svg";
import BritsWhoDesign from "../friends/brits.svg";
import WomenWhoDesign from "../friends/women.svg";
import SpaniardsWhoDesign from "../friends/spaniards.svg";
import Button from "../components/button/index";




const friends = [
  {
    title: "Latinxs Who Design",
    link: "https://latinxswhodesign.com",
    image: LatinxsWhoDesign,
    invert: true,
  },
  {
    link: "https://blackswho.design/",
    image: BlacksWhoDesign,
  },
  {
    title: "API Who Design",
    link: "https://apiwho.design/",
    image: APIWhoDesign,
    invert: true,
  },
  {
    link: "https://uruguayanswho.design/",
    image: UruguayansWhoDesign,
  },
  {
    link: "https://peopleofcraft.com/",
    image: PeopleOfCraft,
  },
  {
    link: "https://queerdesign.club/",
    image: QueerDesignClub,
    invert: true,
  },
  {
    link: "https://womenwho.design/",
    image: WomenWhoDesign,
  },
  {
    link: "https://britswho.design/",
    image: BritsWhoDesign,
  },
  {
    link: "https://spaniardswho.design/",
    image: SpaniardsWhoDesign,
  },
  {
    title: "Brazilians Who Design",
    link: "https://brazilianswho.design/",
    image: BraziliansWhoDesign,
  },
];

const sortedFriends = sortBy(friends, (friend) => friend.title);

const App = () => (
  <Layout>
    <Helmet title="About | DBU Design Corps" />
    <Nav theme="dark"/>
    <div className={styles.container}>
      <h1 className={styles.h1}>Design Corps Directory</h1>
      <p>
      The Design Corps Directory highlights all under represented - 
      scientist, technologists, engineers, artists, mathmeticians and designers - 
      in order to build Earth&apos;s largest pipeline of future inventors,  
      designers, engineers and audacious changemakers across all industries.
      <p style={{ fontWeight: 'bold' }}>As an inclusive practice we:</p>
      </p>

      <h2 className={styles.h2}>Inspire the <h2 style={{ color: '#50E3C2', display: 'inline'}}>dream</h2></h2>
      <p>
      Aim to inspire the dreams of a new generation of public service design leaders, civic media makers and technologists.
      </p>

      <h2 className={styles.h2}>Build superhuman <h2 style={{ color: '#FF375F', display: 'inline'}}>skills</h2></h2>
      <p>
      We endevor to make S.T.E.A.M.D. skills training accesible, affordable and universal to all humans.
      </p>

      <h2 className={styles.h2}>Illuminate <h2 style={{ color: '#BF5AF2', display: 'inline'}}>paths</h2></h2>
      <p>
      We clear, carve, document and share discrete paths to success through radical collaboration and open source innovation.
      </p>

      <h2 className={styles.h2}>Sponsor <h2 style={{ color: '#64D2FF', display: 'inline'}}>Progress</h2></h2>
      <p>
      Equally, advocate, back, underwrite growth with monetary and social sponsorship into positions of power to effect change we want to see.
      </p>

      <h2 className={styles.h2}>Inspire <h2 style={{ color: '#68CD67', display: 'inline'}}>Action</h2></h2>
      <p style={{paddingBottom: '40px'}}>
      Appealing to the value of human life on earth and in the universe, inspire people to enlist, volunteer, donate and act with high judgement, scientific objectivity and creative ingenuity.      
      </p>

      <div style={{backgroundColor: '#1e1e1e', padding: '30px', paddingBottom: '80px'}}>
        <h2 className={styles.h2}>Sponsor the design corp</h2>
      <p>
      The Design Corps is a social benefit business. If you’re interested in sponsoring progress, post a job or make a donation.
      </p>
      <Button
      href={"https://designedbyus.org/donate"}
      style={{
      display: 'inline-block',
      float: 'inline-end',
      width: 'auto', 
      backgroundColor: '#68CD67',  
      color: '#000000', 
      top: '1px',
      fontWeight: 'bold'
      }}>
        <span className={styles.linkText}>Make a donation</span>
      </Button>
      </div>
    
    
      <h2 className={styles.h2}>A World That Works Equally For 100% of Humanity</h2>
      <p>
      Diversity, Equity, and Inclusion is our business model. We want to thank LatinxWhoDesign, BlacksWhoDesign and WomenWho Design teams for the inspiration to start this project and providing a template to help the design community from all backgrounds.  If you’ve found this directory valuable, consider making a donation or taking a look at similar efforts:
      </p>
      
   

      <div className={styles.friendContainer}>
        {sortedFriends.map((friend) => {
          const friendImageStyles = classnames({
            [styles.friendImage]: true,
            [styles.friendImageInvert]: friend.invert === true,
            [styles.friendImageContrast]: friend.contrast === true,
          });
          return (
            <a
              href={friend.link}
              target="_blank"
              rel="noopener noreferrer"
              key={friend.title}
              className={styles.friendItem}
            >
              <img
                src={friend.image}
                className={friendImageStyles}
                alt={`${friend.title} logo`}
              />
              <p className={styles.friendTitle}>{friend.title}</p>
            </a>
          );
        })}
      </div>
      <div className={styles.backContainer}>
        <Link to="/" className={styles.backLink}>
          Back to directory
        </Link>
      </div>
    </div>
  </Layout>
);

export default App;

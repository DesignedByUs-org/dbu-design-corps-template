# Designed By Us™ | Design Corps Directory 

DBU Design Corps is a [Gatsby](https://gatsbyjs.org)-powered Twitter directory that highlights all under represented  STEAMD (Science, Technology, Engineering, Art, Medicine, Design) representatives in order to build Earth’s largest pipeline of future inventors, designers, engineers and audacious changemakers across all industries. It aims to help people find notable and relevant voices to follow on Twitter by parsing Twitter bios for popular keywords.

### The Design Corps Directory accomplishes a number of objectives:

* **For members**, it enables you to brand, market & connects you to allies who are committed to sponsoring your progress. 
* **For Hiring Managers** and #DiversityandInclusion leaders, it enables them to discover, connect, invite and hire highly skilled talent.
* **For Journalists, Event Organizers + Podcasters** it acts a destination to discover, spotlight, hire, interview and include diverse vital voices in #STEAMD 


## Forking this project

DBU Design Corps Directory is using Women Who Design [source code](https://github.com/julesforrest/womenwhodesign) that was build by [Jules Forrest](https://twitter.com/julesforrest). Designed By Us is happy to offer its own version of the source code that you can access by simply forking the template. The following instructions will get you a copy of the project up and running on your local machine to get started.

### Prerequisites: 

This project requires API keys from [Twitter](https://twitter.com) to populate the profile data.
Start by creating an app on the [Twitter developer dashboard](https://developer.twitter.com/en/apps). Select the "Read only" access option.

If you haven't already, clone the repo and open it in your code editor.

On lines 16 and 17 of the `gatsby-config.js` file, replace `process.env.DBU_CONSUMER_KEY` with the consumer key from the "Keys and tokens" page of your app's developer dashboard.

Generate a bearer token by running this command in your terminal, replacing the variables with your consumer key and secret information.

```
curl -u "$CONSUMER_KEY:$CONSUMER_SECRET" \
    --data 'grant_type=client_credentials' \
    'https://api.twitter.com/oauth2/token'
```

Copy the bearer token and on line 18, replace `process.env.DBU_BEARER_TOKEN` with it.



### Generating directory profiles

The directory's profiles are generated from the list of users that the Designed By Us | Design Corps [Twitter account](https://twitter.com/DBU_DesignCorps) follows.

To provide your own user list, replace the number on line 19 of the `gatsby-config.js` file with the Twitter ID of your chosen Twitter account. To get the Twitter ID of your account, provide your handle to a service like [Tweeter ID](https://tweeterid.com/).

Make sure that the account provided is following at least one account and that Twitter ID on line 19 is in quotes.



### Install dependencies

#### Mac: 

If you're new to development, start by installing [Homebrew](https://brew.sh/), a macOS package manager. Paste the following command in your terminal.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

When Homebrew installed, use it to install [Yarn](https://yarnpkg.com/en/), a JS dependency manager.

```
brew install yarn
```

After Yarn is installed, use it to install the dependencies.

```
yarn
```


#### Windows:

Download and install the latest Node.js version from the official [Node.js website,](https://nodejs.org/en/)<br>
Make sure you have installed [Git](https://www.atlassian.com/git/tutorials/install-git#windows) as well. 

The Gatsby CLI tool lets you quickly create new Gatsby-powered sites and run commands for developing Gatsby sites. It is a published npm package.
The Gatsby CLI is available via npm and should be installed globally by running:

```
npm install -g gatsby-cli
```



### Run the project locally

Making sure you're in the correct project folder, start the local development server.


#### for Mac:

```
yarn start
```


#### for Windows:

```
gatsby develop
```


In your browser, open `localhost:8000`.



If you have troubles running your site, refer to the [official documentation](https://www.gatsbyjs.com/docs/tutorial/part-zero/)



## Hosting: 

DBU Design Corps is hosted on Netlify, however Gatsby allows you to host your website on Gatsby Cloud. This official [documentation](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/) explains how to host your website and collaborate with teammates on the project.


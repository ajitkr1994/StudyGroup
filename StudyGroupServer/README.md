Go to cloud.mongodb.com and create a free cluster, or install mongodb locally.
Connect to cluster and remember your username and password.

Here is an example connecting via the CLI to my cluster with my username admin.
Switch the url to your cluster either locally or on the cloud.
mongo "mongodb+srv://cluster0-xnpoq.mongodb.net/test"  --username admin 

Now we will prepopulate the data. Replace admin and url with your username and url.
mongo "mongodb+srv://cluster0-xnpoq.mongodb.net/test"  --username admin  ./StudyGroupServer/scripts/prepopulatedata.js

To reinitialize the database in any case:
mongo "mongodb+srv://cluster0-xnpoq.mongodb.net/test"  --username admin  ./StudyGroupServer/scripts/drop.js
then
mongo "mongodb+srv://cluster0-xnpoq.mongodb.net/test"  --username admin  ./StudyGroupServer/scripts/prepopulatedata.js

Now to run the server:
First edit DBURL in .env
"mongodb+srv://username:password@cluster0-xnpoq.mongodb.net/test"
npm install
npm run serve
# copa-cases
Saving a CSV of all cases stored on the COPA (formerly IPRA) Chicago website, daily

## [View cases here](cases.csv)

[Commit history](https://github.com/CrimeIsDown/copa-cases/commits/master/cases.csv)

NOTE: Only changes will be committed. Thus, you my not see any new
commits for a while, only when cases are added/removed will you see a
new commit.

## Automatic updates

Add this to your crontab to make updates daily at 5pm CDT / 6pm CST:

```
0 22 * * * cd {installpath}; docker-compose up
```

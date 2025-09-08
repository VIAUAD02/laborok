# Submitting your work (GitHub)

We are using GitHub to submit the solutions. The repository is created through a link included in the Moodle. The solution of the exercises are created within these repositories, then committed and pushed to GitHub. The submission is finished with a _pull request_ assigned to the instructor (with GitHub username `siktdavid`).



The submission requirements detailed below and mandatory. Submissions not following these guidelines are not graded.


## Short version, aka. TL;DR

The detailed description below shows the entire procedure. This summary is an overview of the whole process.

1. The exercises are solved in a dedicated GitHub repository created using a GitHub Classroom invitation link published in Moodle.

1. Your solution is submitted on a new branch, not on master. You can create any number of commits on this branch. You need to push these commits to GitHub.

1. You submit your final solution through a pull request assigned to the instructor.

1. You can ask questions regarding the results and evaluation in the pull request comment thread. To notify your instructor use the @name annotation in the comment text.

## Starting your work: git checkout

1. Open the course page in Moodle and find the invitation URL. 

1. If needed, authorize the _GitHub Classroom_ application to use your account data.

    ![Authorize GitHub classroom](images/github/github-authorize-classroom.png)

1. You will see a page where you can "Accept the ... assignment". Click the button.

    ![Accept assignment](images/github/github-accept-assignment.png)

1. Wait for the repository creation to finish. You will get the repository URL here.


    The repository will be private. No one but you and the instructor will see it.


    ![Repository created](images/github/github-repository-create-success.png)


1. Open the repository webpage by following the link. You will need this URL, so remember it.

    ![Repository webpage](images/github/github-repository-webpage.png)

1. Clone the repository. You will need the repository git URL, which you can get from the repository webpage following the _Clone or download_ button.

    You may use any git client. The simplest one is [GitHub Desktop](https://desktop.github.com/) if you do not have a favorite yet. You can list your repositories in this application directly from GitHub.

    ![GitHub Desktop repository clone](images/github/github-desktop-clone.png)

    If you are using the shell or the console, the following command performs the clone (if the `git` command is available): `git clone <repository link>`

    If the login fails with the username/password pair in the case of "Clone with HTTPS", (for a user that has been used for a long time) it is worth checking the expiration date of the Personal Access token on git.

    Down arrow next to the profile picture in the upper right corner > Settings > on the left (bottom) Developer settings > Personal Access Tokens.

    *As an alternative method: instead of HTTP cloning, to use an SSH key, instructions [here](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls) can be found.*

    If you are using Sourcetree, you might need to use a Personal Access Token (PAT) for access as follows:

    1. Head to your GitHub account settings and choose _Developer settings_ from the left menu.
    1. Choose the _Personal access token_ option and click _Generate new token_.
    1. The note field is to remember what this token was created for. Let's give a name, e.g., `sourcetree`.
    1. In the _Select scope_ form, tick every box available and click _Generate token_.
    1. After the generation process, copy the created token to the clipboard and head over to the Sourcetree app.
    1. Go to Tools -> Options -> Authentication.
    1. If you already have a GitHub account set up with some other access token or authentication info, click on it and choose _Edit_, otherwise choose _Add_.
    1. Choose the hosting service as GitHub, preferred protocol as HTTPS, and at the _Credentials_ part choose _Authentication Basic_. Type in your GitHub username, then click on the _Refresh Password_ option.
    1. Copy the created token as the password and click OK.
    1. After this, cloning and pushing to the repository should work.


1. If the cloning is successful, **PLEASE CHECK THE ASSIGNMENT MILESTONE INSTRUCTIONS!** The individual part of your solution should _not_ be committed to the repository `master` branch. 

    Before you make your first commit, check whether your name and email address are properly configured. You can check this using the following commands.



    ```bash
    git config user.name
    git config user.email
    ```



    If the values are not correct, set your name and email address with the following commands executed in the repository directory. This will set the values for the repository. (It is recommended to set the email address to the one you use with GitHub.)


    ```bash
    git config user.name "John Doe"
    git config user.email "john@doe.org"
    ```


    To avoid having to set this for all repositories, you may want to set the name and email address globally using the `--global` switch in the commands above.


    If you are ready with the project initialization as detailed in the actual milestone instruction, create a new branch with the requested name.

    In GitHub Desktop, use the _Branch_ menu for creating a new one.

    ![GitHub Desktop create branch](images/github/github-desktop-new-branch.png)

    If using the console, use the following command: `git checkout -b branchname`

1. Complete the exercises on this branch. You may have any number of commits and pushes.

    To commit using GitHub Desktop, first check if you are on the right branch. During the first push, the _solution_ branch needs to be published.

    ![GitHub Desktop push branch](images/github/github-desktop-commit-to-branch.png)

    When adding further commits, verify the branch. You can publish the commit using the _Push origin_ button. The tiny number on this button shows you how many commits need pushing.

    ![GitHub Desktop commit and push](images/github/github-desktop-push-commit.png)

    If you are using the console, use the following commands:

    ```bash
    # Check the current branch and the files modified
    git status

    # Prepares all changes for commit
    git add .

    # Commit
    git commit -m "commit message"

    # Push the new branch (first time)
    git push --set-upstream origin solution

    # Push further commits
    git push
    ```

## Submitting the solution

1. When you are ready with the exercises, verify on the repository web page that you uploaded everything. You may need to switch branches.

    ![GitHub web switch branch](images/github/github-switch-branch-webpage.png)


    We recommend that you do not use GitHub web file upload. If something is missing, add it to your local repository and commit and push again.


1. When you are truly ready, open a _pull request_.


    This _pull request_ combines all changes you made and shows us the final result. This helps the instructor to evaluate your submission more easily by seeing all changes at once. This _pull request_ means you submit your solution; hence this step **cannot be omitted**.


    To open the _pull request_, you need to go to the repository's GitHub web frontend. If you pushed recently, GitHub will offer you to create the pull request.

    ![GitHub create pull request](images/github/github-create-pull-request-1.png)

    You may also open the _pull request_ from the menu at the top. It is important to specify the correct branches: `master` is the target into which `solution` is merged.

    ![GitHub create pull request](images/github/github-create-pull-request-2.png)

    When the _pull request_ is created, you will see a little number "1" on the _Pull request_ menu showing you that there is one open item there. **YOU ARE NOT FINISHED YET!**

    ![GitHub create pull request](images/github/github-create-pull-request-4.png)

1. The _pull request_ will trigger a preliminary evaluation. You will see the result of this evaluation as a comment added to the pull request thread.

    This will be different for each homework. Your code will be executed and tested.

    ![GitHub create pull request](images/github/github-pull-request-eval-result.png)


1. If you are not satisfied with your work, you can make further changes. You only need to commit and push your changes. Any changes pushed will re-trigger the evaluation of the _pull request_. We ask that you trigger **NO MORE THAN 5 evaluations**!


    If you want to make changes to your submission and not have the re-evaluation run, you should **convert the pull request to draft**.


    ![GitHub convert PR to draft](images/github/github-convert-pr-to-draft.png)

    This state means work in progress. You can commit and push freely. These will not trigger any evaluation. Once ready, you **must** change the state back: go to the bottom of the PR and click "Ready for review." This will set the PR back to its normal state and trigger an automated evaluation.

    ![GitHub draft PR ready](images/github/github-draft-pr-ready.png)


    Evaluations that fail due to transient errors, such as network problems, are not counted into the 5 evaluations. But if you trigger more evaluation by mistake, or on purpose, it will be sanctioned. You are required to **test your solution locally** before submitting it.


1. **FINALLY**, when you are ready, assign the _pull request_ to the instructor. This step is considered as the submission of your work.

    ![GitHub create pull request](images/github/github-create-pull-request-3.png)


    If you have no pull request, or it is not assigned to the instructor, we consider it work in progress and not submitted.



    Now you are ready. After assigning the pull request, **make no further changes**. The instructor will evaluate the submission and close the pull request.


## Questions and complaints regarding the final result

If you have questions or concerns regarding the automated evaluation, use the pull request for communication with the instructor by asking questions via comments. To let the instructor know you have questions, please use `@siktdavid` [mention](https://help.github.com/en/github/writing-on-github/basic-writing-and-formatting-syntax#mentioning-people-and-teams) in the PR comment. This will automatically send an email notification.

![GitHub PR asking questions](images/github/github-question-in-pr.png)

Please note that if you think the evaluation made a mistake, you must support your question/complaint with proof (e.g., show how you tested your solution and prove that it worked).


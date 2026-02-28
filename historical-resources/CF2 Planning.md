
## CF2

Times:
  - Main lecture is Monday / Wednesday, 9:30–10:50
  - Four Recitations on Wednesdays
  - Homework due Friday 5pm
Grade Breakdown:
  - Homework: 50%
  - Exams: 25%
  - Project: 25%
Calendar:
  - 1/13 (Monday) - 1st day
  - 1/20 (MLK) - No class
  - 3/24–3/28 (Monday–Friday) - Spring Break
  - 5/1 (Thursday) - Last day
  - 5/2 (Friday) - Reading day
  - 5/3–5/7 (Saturday–Wednesday) - Finals
Weeks:
  - 1 — Mon Jan 13 - Course overview, Tech Stack
  - 2 — Mon Jan 20 - More Tech Stack
  - 3 — Mon Jan 27 - Ease In (AABB & Complexity)
  - 4 — Mon Feb 3 - Pointers (Linked Lists)
  - 5 — Mon Feb 10 - Recursion (Binary Search Tree)
  - 6 — Mon Feb 17 - Test 1
  - 7 — Mon Feb 24 - Stacks, Queues (Huffman Coding)
  - 8 — Mon Mar 3 - Graphs, introduction (DFS, BFS)
  - 9 — Mon Mar 10 - Graph, applied (Finite State Machines)
  - 10 — Mon Mar 17 - Test 2
  - Bye — Mon Mar 24 - Spring Break
  - 11 — Mon Mar 31 - Applications of DS&A (Collision Detection)
  - 12 — Mon Apr 7 - Applications of DS&A (Half Edge, Tessellations, Voronoi)
  - 13 — Mon Apr 14 - Project Proposal + Hash Tables
  - 14 — Mon Apr 21 - Project Execution + Fun Topic 1
  - 15 — Mon Apr 28 - Project Delivery + Fun Topic 2

## Course Overview

- Typical 1st day of class stuff
- Single lecture that gives an outline of the whole enchilada:
  - What are data structures/algos
  - Why they matter
  - Which ones we’re covering
  - Why those in particular (and why not some others?)
  - Sportsball analogy: the goal is to win games, but athletes don’t just play the game: they practice, they do calisthenics,
they weight train, they watch film, they talk strategy. DS&A will give you intellectual tools, intuitions, and develop your
ability to ‘practice’ with code, just like athletes need to be scholars and practitioners of their sport all year long instead
of just expecting to win the super bowl.
- The weekly cadence: video lectures to get ahead of the curve, homeworks to practice it, when things are consistently due,
and my policies (late things, participation, quality control, communication)
- The testing cadence: a few topics at a time. Just two tests. We’ll rehash all the topics in the first lecture, and have in-
person, on-paper test for the second lecture. Second test will focus on material covered since the first test, but I reserve
the right to include topics that people bombed on the first test.
- Project: we’ll propose, we’ll execute, we’ll present, we’ll deliver. Group or solo, up to you. A 3-person group should be 3x as
impressive as a solo effort. Max 4 people in a group.
- Fun topics: During project times we’ll pick misc topics you’re interested in, and I’ll give talks about those, or rope other
people into giving guest talks. At points during the semester I’ll solicit ideas, we’ll pick them before spring break so I can
prepare material.
Technical Skills: CLI, Git, JS, TS, NPM
- We will use real-world tools, not nerf-covered sandboxes. Not because I’m mean, but because they’re powerful and you’re
edging up on being a professional yourself. Data structures are super powerful tools, and so is the command line. So is Git.
So are programming languages. The point of the class is DS&A but they don’t exist in a vacuum and it is not possible to
learn them in the abstract. You have to work with your hands, and that means tooling.
- CLI
  - Terminals, shells, text-based commands, text-based output, processes, files, streams
  - Shell commands: navigating directories, listing/removing files
  - My CLI Crash Course is a good starting point
- Git
  - Explain in context of GitHub UI since that is visual and a bit more obvious
  - Cover everything in my Git Crash Course gist
  - Git is helpful for collaboration but also for your solo work
- Javascript
  - This should just be a refresher, but in case it isn’t, need high level of language
  - Originally just for browsers, but now runs everywhere
  - Might make sense to make a JS Crash Course gist like I have for C++

- Typescript
  - Adds type annotations to Javascript
  - Adds complexity but can make it more obvious what you’re doing (and what you’re doing wrong)
  - Won’t use advanced Typescript features, as that would be distracting and isn’t the point of class
- NPM
  - The Javascript ecosystem uses a package manager to use other people’s code
  - Will use it minimally here, but since you have to type the npm install command, we’ll mention it
  - package.json and the various script commands
  - jest in particular since we’re using it for unit testing (more on this next week)

## Ease In (AABB)

- First data structure is not a classical “data structure”, but it has all the properties we want (Axis-Aligned Bounding Box):
  - Data: what information comprises the data structure? Both ‘payload’ and structural data
  - Operations on that data: what can we do with it? E.g. its API.
  - How it can help answer useful questions? In which contexts? What are the tradeoffs of using this versus another thing?
- Also exemplifies how to do homework throughout the course: Use git to make your copy & store updates, using CLI tools to
build and run tests, use a local editor to write your code
- Unit testing: code that tests other code. We use jest so will look at how that specifically works.
- Materials:
  - Video lecture
  - Document (similar content as video)
  - Homework
  - Links

## Pointers (Linked Lists)

- Javascript doesn’t give you direct memory access!
- But there are still reference types (objects, lists, functions) that are passed around differently than value types (all the
primitives)
- Be clear: linked lists are not something you generally use in the wild, but they are a good learning tool for your first classical
data structure.
- Materials:
  - Video lecture
  - Document (similar content as video)
  - Homework
  - Links

## Recursion (Binary Search Tree)

- Trees are the kind of thing you might encounter in the wild, or need to write yourself.
- Trees lend themselves well to recursion, as do any box-and-arrow structure where the boxes are self-similar.
- Materials:

  - Video lecture
  - Document (similar content as video)
  - Homework
  - Links

## Test 1

- AABB, Linked List, BST
- Can you follow the code?
  - Here’s a couple AABBs, and the intersect code. Return the intersection according to it.
  - Here’s a linked list. What is the result of find(list, 7)?
  - Here’s a binary search tree and a search function. What’s the result of find(bst, 8) and how many times does it
recursively call find?
  - Here’s a weird recursive function foo. What is the output when we call foo(7)?
- Can you write code? Something like the following:
  - Write a function to return true/false if two AABBs intersect in 2D
  - Write a linked list count function
  - Write a binary search tree insert function
  - Write a linked list largest function that returns the largest value in the list.
  - Write a binary search tree largest function that returns the largest value in the tree.
- Do you understand tricky concepts?
  - Which of the following functions are recursive? What makes them recursive?
  - Here’s a recursive mathematical function to compute some number (e.g. pi, e, rho, whatever). And here’s the related
pseudocode. What is the value of this computation-in-progress after 1 step, 2 steps, 3, 4, etc.
- Can you debug code?
  - Here’s code that inserts a value into a linked list at a certain index, but it has a bug. What is the bug, and how would you
fix it (plain english)?

## Stacks, Queues (Huffman Coding)

- Stacks and queues as related data structures for keeping track of state in various application areas.
- They’re common, not esoteric - very important for daily programming life
- Will use both in the following weeks when we do graphs
- Homework is on Huffman Coding, an application of a priority queue and trees
- Materials:
  - Video lecture
  - Document (similar content as video)
  - Homework
  - Links

## Graphs, introduction (DFS, BFS)

- Graphs are also ubiquitous, used to model relationships of just about anything

- Doing this over two weeks - first is about depth and breadth first search algorithms for the homework
- Beyond DFS/BFS, there are zillions of things you can do with graphs: find the shortest path between two things, compute
how strongly connected two nodes are, use it as a model for AI, among so many more. We’re picking one application area
for next week, but students have to be aware of the flexibility and ubiquity of graphs.
- Directed and undirected graphs; the concept of cycles; combine those ideas to present a DAG for modeling requirements-
based, goal-seeking algorithms like getting a university degree or a video game character unlocking the dungeon door. Not
in homework but fair game for test.
- Materials:
  - Video lecture
  - Document (similar content as video)
  - Homework
  - Links

## Graphs, applied (Finite State Machines)

- Common application of graphs: in user interfaces, embedded systems, compilers, physical computing
- Graphs are really everywhere, so we want to do something more with them and this is relevant to Atlas students who will
build UIs or do physical computing projects
- Statecharts are a related, more complicated also more feature-rich structure. Show something of how they work as well.
Fair game for test.
- Materials:
  - Video lecture
  - Document (similar content as video)
  - Homework
  - Links

## Complexity (Sorting)

- This is an analytical way to know how efficient an algorithm is
- You can do this with any of the algorithms (data structure operations) that we’ve covered in this course
- But we’ll focus on sorting algorithms because that is a good starting point
- Will also look at complexity of algos we’ve done so far
- We’ll also pick three “fun topics” (see below) for the last few weeks of the class.
- Materials:
  - Video lecture
  - Document (similar content as video)
  - Homework
  - Links

## Test 2

- Stacks/Queues, Graphs, FSMs, Complexity
- Can you follow the code?

  - Here’s a stack and a series of push/pop/peek operations and an initial state. What is the state of the stack at the end?
  - Same question for queue. Maybe even use identical values.
  - Here’s a state machine and a sequence of events. What state does the machine end up in?
  - Here’s an algorithm that works on a graph, and a diagram of the graph’s state. Given this code, what is the result?
- Can you write code?
  - Using a stack, write a depth-first search for an undirected graph in pseudocode
  - In plain english, what would you need to change about your approach if the graph was directed?
- Do you understand tricky concepts?
  - What is the runtime complexity of these three functions?
  - What is the space complexity of this?
  - Here’s a graph. Is it possible to traverse from A to B? Are there cycles?
- Can you debug?
  - Here’s a FSM. The intent is for it to do X, but it keeps getting stuck in state S. Why? And in plain english, how would you
fix it?
  - Here’s a linked list function that does X, but it has a bug. What’s the bug and how would you fix it?

## Spring Break

Summary of the course so far, and what remains:
Everything up until this point was the content that you’d likely get in a CS program. The homework and tests will give them a
grade on all of that stuff. Late homework assignments can still be turned in until the last day of class.
Everything after this point is about enrichment and covers topics that will help out Atlas students as they will work with digital
media in the future. The ‘Applications’ weeks are things that I’ll just assert they need to know about and will have homework.
The ‘Fun Topic’ weeks don’t have homework are for focusing on their project and getting some additional content that they
choose, and I’ll find a way to give talks on them.

## Applications of DS&A (Collision Detection)

- Collisions are about hit testing of various sorts - points in 2D regions, stationary 2D regions intersecting, will moving 2D
regions intersect and when. Can help answer questions like:
  - what did you click on? what if there are several things stacked up?
  - Do objects currently overlap
  - Given objects and their movement, when will they touch or overlap?
- A related topic is parameterizing paths as a function of time or distance to compute things.
- This is used in probably every user interface - boring business apps (because which button did you click on?) or interactive
art things (which virtual garden beds are getting rain?) or video games (did the thing I just threw hit a wall, a bad guy, the
floor, and how would it bounce if it did?)
- If there are lots of possible collisions, you’ll need to be clever about setting up data structures so you can do as little work
as possible while still getting the right enough answer, so structures like quad trees or oct trees will be helpful.
- Homework will be to collide lines, line/rectangle, rotated rectangles, lines/polygons, polygon/polygon
- Materials:
  - Video lecture
  - Document (similar content as video)

  - Homework
  - Links

## Applications of DS&A (Voronoi, Half Edge, Tessellations)

- This week will be about forming groups for a project. Groups will pick their own topic. 2–4 people. We’ll make a schedule
about which groups will present current status on which days in the coming weeks. Double dipping projects with another
class is OK.
- A Voronoi diagram will tell you which regions on a surface are closest some set of sites. It is a fun visualization, and often
used in games. E.g. always knowing which monster (site) is closest to the player (at whatever location they happen to be).
The homework will be to make a Voronoi tessellation based on a set of input sites.
- 2D and 3D objects are often posed as triangular meshes so we can work with them more easily.
  - How can you approximate a mathematically ‘pure’ thing (like a sphere) with a triangular mesh (something like a soccer
ball)?
  - How good does it really need to be? How bad can it be before you notice? Maybe those questions depend on what the
geometry means? E.g. we are very discerning with facial expressions but not so much about other things, so maybe a
character’s face needs more triangles than their shoes?
  - What are some data structures for representing meshes? We will specifically cover Half Edges.
  - How can you do math on a mesh? E.g. find all the vertices that are within X distance of the edge? Or some point on the
surface? Which faces point in this direction (±tolerance)? Which face(s) collide with a given ray, and what is the angle of
incidence?
- Materials:
  - Video lecture
  - Document (similar content as video)
  - Homework
  - Links

## Project Proposal + Hash Tables

Monday: 1/6 of project groups present status, + hash table lecture part 1
Wednesday: 1/6 of project groups present status, + hash table lecture part 2
Proposals are short (400-750 words, with graphics/diagrams). Grade on (a) clear topic, (b) clear presentation.
There is no homework associated with hash tables.

## Project Execution + Fun Topic 1

Monday: 1/6 of project groups present status, + my topic lecture part 1
Wednesday: 1/6 of project groups present status, + my topic lecture part 2
No project-related things are due this week.

## Project Delivery + Fun Topic 2

Monday: 1/6 of project groups present status, + my topic lecture part 1
Wednesday: 1/6 of project groups present status, + my topic lecture part 2

Projects are due on the last day of classes and will be in video form, 8 minutes max. Details TBD but generally about good
presentation. They should be something for ‘archiving’ into their portfolio. Github repository with all source code with a
README to help people understand what it is. Grade on (a) clear presentation and (b) demonstration that they learned
something worth the time.

## Sequence Punchlist

Each sequence should cover some abstract concepts (like references, recursion, partitioning, hashing, complexity) and focus
on some specific data structure.
When talking about a particular data structure, should hit these main points:
- What they’re for
- How they model data
- How to initialize them
- How to use them
- How to analyze them (time/space complexity of each operation)

## Tech Stack

This class is about data structures and algorithms. I suppose that could be taught without a programming language at all,
because at its core it is about organizing data and applying procedures against it. You could work that kind of thing out on
paper, or a whiteboard.
But to really get the most of this course, you’ll need to write code to implement the data structures and algorithms. So this
means we have to pick a particular technical environment. There are several parts to this and it might take some time and
troubleshooting to get everything working.
Here’s a punch list of things to work through. We will cover this in depth during the first two weeks of class. You’ll need to install
some things (an editor, NodeJS, Git) and “install” yourself on Github by making an account.
Checklists
Things to Install
- Editor: install a code editor like VS Code on your computer
- Optional AI Terminal: A CLI terminal with AI built in might help anyone, beginners and seasoned pros alike. You can get by
without one. But Warp (Mac/Linux) or Powershell (Windows) could make life easier.
- NodeJS & NPM: Install NodeJS, which comes with NPM. This is the JS toolchain for homework.
  - Folks new to all this probably should install it from nodejs.org.
  - People already comfortable with development might use a system package manager like homebrew and use that to
install node
- Git: Install the git tool on your computer used to get and submit homework.
  - Optionally, get a GUI like Github Desktop. Good for beginners and works everywhere.
  - Homebrew users can install git that way on Macs
  - Apple/mac purists might use xcode-select as an alternative
- Github: Github is the hosting service for our homework. Make a free Github account.
  - Making a Github account for the first time? Keep in mind your Github account name will stick around after this class is
over, and future employers might form a first opinions about you when they see it. So make it classy? Not something like
lazerweed666?
Things to Learn
- Command Line Interface: know how to start a terminal (either in your editor or from the operating system) and use it (at a
minimum) to run npm commands. I have a CLI crash course.
- Using Git and Github: Check out my Git crash course.
- Typescript: this language extends Javascript by adding type safety. This will be installed when you get your homework
assignment set up. Typescript overview over yonder.
More info about the tech stack
If you’re curious, keep reading. Otherwise you can stop here. Just take care of the checklist items above.
Typescript

In data structures courses it is common to use a language like C or C++, and that is what the Computer Science department
has done at least since the late 90s. Java and Python are also common choices.
We will use Typescript as our language for this course. Typescript is an extension of Javascript, so if you know Javascript
already, you only need to learn a little bit of additional syntax. If you don’t know Javascript already, we will have a brief crash
course in it coming up. Recent ATLAS CF1 classes have used Javascript, so most students should be familiar with it.
There are two main reasons to use Typescript:
1. Portability. You can write in any language on any platform, but some languages make it easier than others to write and run
that same code in different environments. In particular, C and C++, while being standards-based, still tend to behave
differently on different systems due to their nature of being “close to the metal”, as they say. Typescript is based on
Javascript, and Javascript code written on a Mac will typically work in the same way in a Linux or Windows environment.
And vice versa. This also means that platform specific hurdles will be less common when we do homework assignments.
2. Profession options. In ATLAS, many students are interested in “creative coding”, UX design, and similar expressive
endeavors. In that context, Javascript and Typescript both excel. Familiarity with Javascript will prepare you for working
with many other languages that share syntax with C. And because Typescript introduces static type checking, knowing
Typescript gives you a serious head start in other statically typed languages like Java and C#. According to the
Stack Overflow annual developer survey Javascript has consistently ranked as the most popular language nearly every year
the survey has been conducted, and Typescript is very popular among Javascript developers.
Command Line Interfaces
If you have ever used an LLM Chatbot, you’ve used a form of CLI.
Using the command line interface is not really the point of the class, but along the way it will help you significantly if you learn
to use it to some degree. I have put together a “CLI crash course”, distributed as a simple Github gist. (More on Github below.)
Command line interfaces are appealing to programmers because they work with text inputs to perform actions. You can type
those text inputs interactively, or you can write programs that script command line interactions. They can seem daunting to
beginners, that’s fair. But even a beginner can learn enough of the command line to work with the homework assignments.
I’ve personally been using a terminal program called Warp that has AI built in, so if you don’t know exactly what to type, Warp
can usually give you an assist. As of today it is only for Mac and Linux with Windows support on the way. There is experimental
AI support for Powershell in Windows, apparently.
NodeJS and NPM
Javascript was made to run on browsers in the 1990s, but by the 2010s it was in use in many other places including web
servers. NodeJS (node) is the most popular runtime environment for running Javascript outside of browsers. The Node
Package Manager (npm) lets developers use 3rd party packages easily.
All of our homework assignments use npm to pull together the required dependencies, and use node to run the code.
Git
The git tool is used to manage source code. It is often used on the command line, and most (all?) of my examples will use the
command line instead of a GUI because the command line can be used anywhere, and once you get the hang of it, you’ll
probably prefer it to a GUI anyway.
Source code managed by Git is grouped in what’s called a repository. When you make your copy of the homework, you are
cloning a repository from Github and creating a new repository on your computer. Then you’ll work on your homework and use
Git once again to push your changes back to the repo on Github.
Github

Github is a “social coding” platform that hosts Git repositories. There are many services like Github, like Gitlab and Bitbucket.
Github is by far the most popular. You can interact with source repositories through their web site, and it makes a lot of things
much easier than it is with the command line.
Github also lets us run code on their system. This is how your homework will be graded. You can run the same grading code on
your local computer.
Editors
To work on any software code base you’ll need an editor. There are lots of options (Sublime Text, Atom, Notepad++, or big
fancy IDEs like Eclipse or WebStorm). My examples will all use VS Code. In my experience this is what most Javascript
developers use.
Modern editors typically let you work with files, and include a built-in terminal for working with the CLI.

### S01: AABB

#### Preamble (Sequence)
Hello! And welcome to this introductory sequence for data structures and algorithms. Each sequence is broken into smaller
episodes so it is a bit easier to get through.
This sequence introduces the course’s topics using a straightforward data structure that I’m hoping is within your reach, so we
can lay down some foundations before getting on to the trickier ones.

### E01: About Data Structures & Algorithms

#### Preamble (Episode)
This first episode is really just about orienting you about the basics of data structures, what they’re for, what they look like, and
a bit about how we’re going to ease into things with our first simple data structure.
Why are we even here?
This course is aimed to help people who have learned a little bit about writing code and aspire to do much more. You might be
struggling to translate your ideas into programs, or you’re having trouble structuring your code so it is easier to work with. But
ultimately, the thing you probably want to do is to build amazing things.
I’ll go out on a limb here and say the thing you’re probably not aspiring to learn is “data structures and algorithms”. But
underneath every piece of software is code that executes set procedures using well-formed data. Those procedures are
algorithms, and the well-formed data they work with are the data structures we’re covering throughout this course.
Think in terms of what you know
There’s the old trope that if all you have is a hammer, all you see are nails. It pays to get more tools to solve a bigger range of
problems. Metaphorically, this class is about giving you all the other tools in the shed, and the ability to make your own when
you need to.
If your goal is to write great software, then you will need to develop a good intuition for the fundamentals. People tend to think
in terms of what they know. If you don’t have an intuition of data structures and algorithms, you’re really limiting your cognitive
prospects, and limiting what you can create with software!
Structured Data
A data structure is exactly what it says on the box: it is structured data. That’s it! If you’ve written much code yet, you’ve
probably made them yourself without really realizing it.
Maybe you’ve made a game with the player’s space ship and some alien bad guys. You probably modeled those things
somehow, maybe with variables, lists, classes and objects? Like a ship’s position, heading, and acceleration? Congrats, you’ve
already made some data structures.
Algorithms
The other half of this course’s name is algorithms.
The data structures you made for your space game were probably used by other code that decided which things to move -
which direction and how quickly, and what happened when they interact. Those are algorithms, and you’ve probably written
bunches of them by now.

‘Classic’ Data Structures
There are certain ‘classic’ data structures you will find in courses like this, and for good reasons! This is no exception.
It is possible that you independently re-invented a classic data structure when you were learning to program and building
space games. Probably not. But if you did, we’ll probably have to put your name on it, and then future generations will reference
it that way and study it in classes like this. Which would be cool.
Here are some classic data structures, and we’ll get into detail on these later, throughout the course.
Linked lists
First we have linked lists, which is built out of simple nodes that hold data, and a reference to the next node in the list. The last
thing in the list points to a special ‘nothing’ value.
Lists are linear, so they have this skinny shape.
Trees
Then we have trees, which are like lists, except each node can hold references to more than one subsequent node, and the
ones at the bottom point to that ‘nothing’ value. With trees, each node except for the one on top is referenced by only one
other node.
Trees are bushy - they flay out as you go deeper.
Graphs
Then there are graphs, which are much like the trees I just mentioned, except we remove the rule about nodes only having one
incoming reference. There are many kinds of graphs, for example some allow you to form cycles, and some don’t.
Graphs can have any shape depending on the data they model.
Tables
Now leaving the ‘box and arrow’ world as I like to think of it, there are also table structures, which let you look up information
by having some sort of key. Like if your key is some alphanumeric code, you can use it to look up its definition in a dictionary -
that’s roughly how those work. The most well known type of table is a hash table. The fun part here is that you can convert
anything into a number (called a hash) and use that as the key for looking up data. We’ll cover hashing later in the course.
A simple data structure to begin
Rather than jumping right in to the classic data structures, I thought we’d ease into things with a simple but still really useful
data structure so we can learn how to talk about these things - what they’re for, how they model data, how we initialize them,
how we can use them, how we can analyze them, and so on.
So for the rest of this sequence we’re going to focus on this useful little structure called an Axis Aligned Bounding Box in order
to ramp up to the more complex ones covered throughout the course.

### E02: Axis Aligned Bounding Boxes

#### Preamble
An axis aligned bounding box is a simple tool that we can use to speed up hit detection, like, did I click on this thing, that thing,
or none of the above. It is a simple but really useful data structure, and we’ll use it to get started in the course.

What they look like
An Axis Aligned Bounding Box is a rectangle that surrounds an object or part of an object and is used to quickly determine if
items might overlap, or if maybe you’ve clicked on them.
Hit tests and intersections
So if I have these four bounding boxes, we can use them to detect potential intersections between them, or check if we might
have clicked on them.
This is common in really any interactive graphics application, and I don’t just mean video games. CAD or modeling tools, and
even basic business or web applications can make use of these.
Hit testing the hard way
Say you have some complicated object that has holes in it, or a weird boundary with concavities or doodads sticking out. The
boundary might be made up of hundreds of little line segments. How would you determine if you’ve clicked inside of it? There
are lots of ways that you can do this, but here’s one common way called “Even-Odd Winding”.
Hit testing the hard way 2
Draw a horizontal line that passes through your point, and count the number of times it intersects with the shape’s boundary
before it gets to your point. If you find an odd number of intersections, the point is inside the shape.
Hit testing the hard way 3
So now you’re intersecting your horizontal line with maybe all of the line segments that forms your boundary. You can be clever
about which ones you choose, but all that cleverness and line intersection is just more math that your program has to do. And if
you have hundreds or thousands of shapes on screen that you might have clicked on, all that math can make your program feel
sluggish.
Can we avoid needless work?
It would be nice if we could avoid doing all of that work if we had a really cheap way to determine if the point is outside of the
shape. And that’s one of the main uses for an AABB: it can tell you if a point is definitely not inside the shape, or if it might be in
the shape. And if it might be in the shape you’ll still have to use a more computationally intensive routine to know for sure. But if
an AABB can help us avoid lots of pointless work, we should use it!
Hit testing rectangles is easy
If you use the Even-Odd Winding approach with a rectangle, you only have four line segments that could intersect with your
horizontal line, and that is pretty “easy” to do, computationally speaking.
Even easier with axis aligned rectangles
But it gets even easier if the rectangle is axis-aligned. That means that the rectangle’s boundaries are parallel to the coordinate
system: they are either totally vertical or totally horizontal. So going back to our complicated shape with holes and
weirdnesses, if we can make the smallest axis aligned rectangle that encloses our shape, we’ve made a proper Axis Aligned
Bounding Box.
Use inequalities

When you have an AABB, think of the rectangle itself as the middle part of a tic-tac-toe board if you extend the bounding lines
a ways. There are nine regions. And you can determine which region the point is in by comparing its x/y values with the x/y
values of the box.
Look at X and Y dimensions independently
If you only consider one dimension at a time, it is maybe a little easier to think about how you’d code it. Consider just the Y
dimension, which is vertical. In that situation, you want to know if your target point is above the rectangle’s top edge, or to
below of the bottom edge. If that’s true, you know it is not within the box’s vertical range. If that’s false, your point is in the
vertical Y range.
Next build
It works exactly the same with the X dimension, horizontally from left to right. Is your point to the left of the left edge or to the
right of the right edge?
Next Up
Next up we’ll look at how you can build an axis aligned bounding box and the operations you’ll use with them.

### E03: Building an AABB from points

#### Preamble
Now we’re going to introduce axis aligned bounding boxes from a code perspective - what they are, what they model, and how
to use them.
<Graphic of shape and shape-with-AABB>
The good news is that it is very easy to build a fresh bounding box from a shape, assuming we have a shape made out of line
segments - so, no circles or elliptical arcs or splines or whatever. Just a bunch of points connected by straight lines.
This episode lays out what we’re modeling in plain english, and how we’ll pick a good initial empty state, and how we’ll build up
geometry. I’ll get to the code in the next episode.
Structure
An axis aligned bounding box has to record the extents of some geometry. This means we need to record the smallest and
largest value in all dimensions. In 2D this means we need four numbers:
- Smallest X
- Largest X
- Smallest Y
- Largest Y
If we were dealing with 3D, then we’d need two more numbers for smallest and largest Z value.
Structure 2
Anyway, this means that it doesn’t matter how complex the geometry is that the AABB encloses. We only need these four
numbers to record where the bounding rectangle is.

Typically programming languages give you the means to organize your data. In C these are called structs, and other languages
like C++, C#, and Javascript give you classes and objects. In Typescript you can use also use types or interfaces.
Structure 3
Here is a Typescript definition for an AABB using the type keyword:
```typescript
type Aabb = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
```
This says that an Aabb has four fields named minX and so forth, and they are all numbers.
Other languages will have different syntax, but the intent and the information encoded will be the same.
Initial State
Every data structure has some initial state when it is ‘empty’ in some sense. Say you’re going to make a shopping list. Your list is
a data structure, and at first, before you add anything to it, there’s nothing there. It is all ready for you to add that first thing, but
until you add it, your list is empty.
Initial State 2
For AABBs, the initial state would be for containing zero points. And that sounds kinda funny to think about, since it isn’t really a
box if it has no geometry, right? But thinking about our empty shopping list, and how we can add things to an empty list, we
can think about an empty AABB that initially has no geometry but that we can then add to.
So what does empty mean when we have an Aabb with the definition here? We could just have a null reference, but then we
can’t use it to add geometry. We can’t just initialize the fields to zero, because that actually means something, that the
geometry is a single point at the coordinate system origin.
Initial State 3
For reasons that will become clear in a moment, we will initialize the fields to infinity. Specifically, positive infinity for the
minimum X and Y values and negative infinity for the maximums.
```typescript
const emptyAabb: Aabb = {
  minX: Infinity,
  maxX: -Infinity,
  minY: Infinity,
  maxY: -Infinity,
}
```
For most data structures, the initial value for fields should be chosen carefully so they work with your algorithms, instead of
requiring special checks. How you do this depends on the data structure and how you’re going to use it. You’ll start to develop
an intuition for these things as you progress.

Adding geometry to an AABB
In our case, the source geometry is just a bunch of points connected by line segments. Now that we have an initially empty
AABB, how can we start adding to it? We’ll do it one point at a time. In general the process might be like this:
If the input point’s X value is less than the current minimum X, update the minimum X.
If the input point’s X value is greater than the current max X, update the max X.
Do the same process for the Y dimension.
First point
You might have thought that adding the first point would be a special case since the initial AABB has those weird infinity values
in there. But those were actually chosen intentionally so the above approach would work. For the first point, your X value is
guaranteed to be less than positive infinity, and greater than negative infinity.
After the first point, both the minimum and maximum X values are the same. Ditto for Y values. Now we have an air-quote
“rectangle” that is just a single point. You can call this a “degenerate” case since rectangles are supposed to have area, and this
one doesn’t. That’s an actual math term! Degenerate.
Add all the points
Adding subsequent points is exactly the same process as adding the first. The only difference is that once you’ve added two
distinct points, the rectangle now has either width or height, and probably both. And even if the source geometry has a billion
points in it, your Aabb will only ever have those four numbers!
Next: code to build AABBs
In this episode we’ve talked about how to build up Axis Aligned Bounding Boxes in plain english. In the next episode we’ll get to
some code: how to implement what we’ve just talked about.

### E04: Code to build AABBs

#### Preamble
So we’ve talked about what an axis aligned bounding box is and in plain English, what we can do with them. In this episode we’ll
talk about how to build them.
Common elements of data structures
In general, data structures will have a few kinds of code. This will be the case for all the data structures we cover in this course,
and this will be true of most of the data structures that you build for your specific situations. These common elements for data
structures are that we have a definition for what data they encode, we can initialize them, we can modify (or mutate) them, we
can query them, and all the while we have rules called invariants about what we can, must, and must not do.
Define
You need to define the structure. In our case with Typescript, we do this with the type keyword, and we’re saying it has four
numbers that represent the minimum and maximum X and Y values.
Initialization

Commonly, data structures all have some kind of ‘empty’ value that is ready to begin using. What values should you set your
structures fields to? Here we’re setting them to positive or negative infinity, so that later when we add points, their initial values
work nicely with the code.
Mutations
Your data structure will have operations to modify it - adding data, removing data, re-organizing data, and so on. These
operations are sometimes called ‘mutations’. For our bounding boxes, we’ll add geometry. Generally mutations don’t return a
value, but instead modify the structure.
Queries
We can ask questions of our data structure, like maybe ‘how many things are in it’, or ‘what is the last element’, and so on. These
operations generally do not modify the data structure, but they do return values. They’re often called ‘queries’. For our bounding
boxes, we’ll have queries that get the box’s width, height, and area, and another query that calculates the intersection between
two AABBs.
Invariants
Invariants aren’t necessarily code but they are rules about how the code must behave. We’ll cover invariants in a later
sequence. But for now, one invariant we might have for an Aabb is that if it isn’t empty, the minimum values must be less than
or equal to the max values.
Recap of Aabb definition
In the last episode we saw a little code about how we’ll define our model our axis aligned bounding box. It looks like this:
```typescript
type Aabb = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
```
Initialization function for AABB
```typescript
/**
* Create and return an empty AABB, using Infinity and -Infinity for the min/max
* values respectively.
*/
export const initAabb = (): Aabb => {
  const empty: Aabb = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
  };
  return empty;

}
```
In the last episode we talked about why these particular initial values make sense. The thing we’re doing here, beyond what
was shown in the last episode, is how we have a function that initializes a new Aabb with the right values and returns it. So we
can just use this whenever we need a fresh bounding box.
Add points
```typescript
/**
* Adds a point to a bounding box. If the point is outside the bounding box, the
* box's extents will grow. If it is inside the box, this has no effect.
*/
export const addPoint = (aabb: Aabb, x: number, y: number): void => {
  aabb.minX = Math.min(x, aabb.minX);
  aabb.minY = Math.min(y, aabb.minY);
  aabb.maxX = Math.max(x, aabb.maxX);
  aabb.maxY = Math.max(y, aabb.maxY);
}
```
This is a mutation function that takes an Aabb to work with, and x and y values that might grow the box’s extents. For
example, we will update the min X value to be whichever is smaller: the box’s min X, or the input X.
Aside: not using class methods
If you’ve written much code in any language that uses classes, you might find it weird that we’re not using class methods. We
totally could have done that! But I am intentionally trying to avoid going into language-specific topics so these lectures can be
portable for other languages as well. So this and all the examples that I will give will use functions like this that only operate on
the inputs given to them.
If what I just said doesn’t mean anything to you, don’t worry.
Query: does this thing have data?
```typescript
/**
* If the given AABB has been initialized with at least one point, return true.
* Otherwise return false.
*/
export const hasData = (aabb: Aabb): boolean => {
  return (
    aabb.minX !== Infinity &&
    aabb.minY !== Infinity &&
    aabb.maxX !== -Infinity &&
    aabb.maxY !== -Infinity);
}
```
Here’s a function that tells us if the given bounding box has data. Remember that we initially set the fields to plus or minus
infinity? This just tests to see if the fields are in that situation. And if they are, we don’t have data and return false. Otherwise
it returns true.

I can think of at least one other way to implement this function that doesn’t test for infinity. Can you?
Query geometry
```typescript
/**
* Returns the height (change in y) of this bounding box. If the bounding box
* does not have data (according to `hasData`) this returns NaN. If the box has
* only a single point, it has no width, height, or area, so it should return
* zero in that case.
*/
export const getHeight = (aabb: Aabb): number => {
  if (!hasData(aabb)) {
    return NaN;
  }
  return aabb.maxY - aabb.minY;
};
```
We have a few queries around geometry: what is the box’s height, width, and area? This shows the one for height. Notice that
we use the hasData function that we just covered. If the box does not have data, the instructions say to return the special ‘not
a number’ value, which is written NaN in Javascript. Otherwise, we calculate the height as the difference between the min and
max Y values.
The function for getting width is almost exactly the same. And the function for calculating the box’s area can simply use the
getWidth and getHeight functions and multiply those values together.
Next
In the next episode we’ll look at hit testing points and checking for collisions between boxes.

### E05: Hit testing and intersections

#### Preamble
We just covered how to initialize and build up an AABB from geometry. In this short little episode we’re going to look at code for
the query functions - hit testing and finding intersections.
Remember why we use AABBs
Remember that one of the main reasons to use an axis aligned bounding box is to give a computationally cheap way to
determine if a point is possibly inside a shape or not. Another purpose is to check if two boxes have an intersection - if they do,
it might mean the two shapes are colliding.
Hit Testing
```typescript
/**
* Given a box and a point, return true if the point is strictly inside the box.
*/
const hitTest = (box: Aabb, x: number, y: number): boolean => {
  // TODO

}
```
Here I’m only showing the hitTest function’s documentation and signature. So we have plain english about what it should do,
and we can see that it takes an Aabb called box and two numbers called x and y. And we also see that the function should
return a boolean. But there’s no implementation! Because I’m mean!
Think about what we’ve covered already. The box has min and max X and Y fields. How would we use those and compare them
to the input point’s x and y values? In English: “the x value is inside the box if it is larger than the box’s minimum and less than
the box’s maximum.” And we can do the same for the y value. And the point overall is only inside the box if both of those are
true.
Intersections
```typescript
/**
* Given two boxes, return their intersection as an AABB.
*
* If there is no such overlapping rectangle, return the same thing as
* initAabb().
**/
export const intersect = (box1: Aabb, box2: Aabb): Aabb => {
  // TODO
}
```
Here I go, being mean again. This is the function to intersect two boxes, minus the implementation part.
Draw pictures!
In this case, and really just about any other situation where it isn’t obvious what to do, I will recommend the same thing every
time: draw a picture. Ask the picture, “what are all the ways that two boxes can be arranged?” What if they overlap in X but not
Y? What if box A entirely encloses box B? Or if box B encloses box A?
Then look at your drawings, and relate them to the data structure. Each edge will be a min X, or max Y, and so on. What
relationships do you see? How would that relate back to code?
Intersection implementation
Keep in mind that this intersect function should return an Aabb. So if there isn’t an intersection, you can just return
initAabb(). If there is an intersection, you’ll build a new Aabb for the rectangle representing the intersecting region of the two
input ones. And again, look at your sketch and ask it to visually give you the answers.
You’ve already written code to initialize an empty Aabb. You can use a similar approach to build a new Aabb from known
values. All you have to do is identify the top left and bottom right corners that model the intersecting region’s min and max
points.
Get some practice in
And with that, I wish you good luck on the homework. If you’re enrolled in my class you should have access to this. It is on
Github, written in Typescript, and the unit tests should let you know if your code is doing what it needs to do.
See you in the next sequence.

## Computational Complexity

Sequence Preamble
You often want to know how efficient your code is. And we have ways to analyze algorithms to tell us how many resources it
will take, based on how big the input size is. Usually the thing we care about with a passage of code is how long it will take, and
sometimes we care about memory. But there are other types of resources we could care about, like number of network calls, or
some particular computation like an inequality test. But generally when we analyze code we’re interested in how long it takes,
and how much memory space it takes.

### E01: Time and Space

Episode Preamble
This first episode is about what we really mean when we talk about time complexity, and space complexity. This has nothing to
do with Einstein’s theory of relativity, though the words “time and space” always make me think of that.
Example code
We do complexity analysis on units of code that runs on an input that could be short or long, and we want to know how much
time or memory it will use. So you could take this following function as an example:
```typescript
function countLarrys(names) {
  let count = 0;
  let n = names.length;
  for (let i = 0; i < n; i++) {
    if (names[i] === "Larry") {
      count++;
    }
  }
  return count;
}
```
This is a silly function that takes an unordered list of items, and counts the number of items that equal the string “Larry”. Stare
at this, and ask yourself, how many things do we have to look at in order to get a reliably accurate Larry count? You probably
already have an intuition that you’ll need to look at everything since you have no way to know where Larry might be.
For-loop
So intuitions aside, we can and should also look at the code itself to do the analysis. Since the algorithm here is the source of
truth, not our English description of it.
```typescript
for (let i = 0; i < n; i++) {
  // this loop will run n times
}
```
Look at the for-loop. This is where we spend most of the time of the algorithm. We start at item 0, and go all the way up to the
last one, when i is n-1. So if we have a short list of, say, 100 names to look through, this will take 100 steps. But if the list is

long, say a billion names, then it will take a billion steps.
The important thing here is that the time this algorithm takes depends on the input size. And specifically, the time it takes is
linear with respect to the input size. I give it ten things, it takes ten time units; I give it a billion things, it takes a billion time units.
And any other number that you want to use.
Runtime complexity and big-oh
The words we use in algorithm analysis and complexity sure do sound fancy, but underneath all the jargon is a very simple,
intuitive idea: if you tell me how big the input size is, I can tell you roughly how long something will take, expressed in terms of
the input size.
For our dumb Larry-counting example, it was a one-to-one ratio. So if you give me N things, the algorithm will need N time. And
we write that like this: O(n) and we say “big oh of n”, or just “oh of n”. This is called the runtime complexity.
Space complexity
We also can use space complexity to measure how much information we have to record somewhere, probably main memory, in
order to complete the algorithm. In our Larry example:
```typescript
function countLarrys(names) {
  let count = 0;
  let n = names.length;
  for (let i = 0; i < n; i++) {
    if (names[i] === "Larry") {
      count++;
    }
  }
  return count;
}
```
... the only spots we are recording data are on the first couple of lines - we make a variable count, and then as a convenience
we make one for n. The number of things we have to remember will always only be two - it doesn’t matter how big the input
size is. So we say that this is constant space complexity, and we write that as O(1) - the one is a stand-in for “constant
number”.
Phone book example
To make this a bit more everyday... think of how you’d use a phone book, if for some strange reason you needed to use a phone
book at could actually find one. Phone books are alphabetized by last name. So if you want to count all the Larrys in the phone
book, how many pages will you have to turn? All of them!
Common runtime complexities
There are only a few families of runtime complexity that you’ll typically see. We just looked at linear time - that is, O(n). The
others you’ll commonly see are like this list. I’ll go over each one in the next few slides.
O(1) is constant time
This means the algorithm’s runtime doesn’t actually depend on the input size. For example, what is the length of the input list?
In Javascript, we know that right away, we just return names.length and call it a day. Doesn’t matter if there are zero or a billion

things in the list, it takes the same amount of time to give the answer. So when we draw that, we have a straight, flat line.
In the phone book example, this would be, I actually know which page to turn to from the beginning. There, page 227, I found
Larry in one step. When we look at hash tables, you’ll encounter this kind of runtime.
O(n) is linear time
O(n) is what we just saw. Since it is a one-to-one ratio, the curve is a straight line going up at a 45 degree angle, and we call it
linear time. Phonebook-wise, we have to flip to every page.
O(log n) is logarithmic time
Logarithmic just means (very roughly) that the time is proportional to the number of digits. That’s not really accurate but for
practical purposes that’s actually a good working definition. So if we have an input with ten thousand things, that has five digits,
so a logarithmic algorithm will take about five steps. Logarithmic runtime is very good, but it is not quite as fast as constant
time, since the curve does grow with the input size, but very very slowly. We write this like O(log n) and pronounce it “oh of
log n”.
The phonebook example here might be to find Larry Johnson. We get the last name. Since the phonebook is sorted by last
name, we can flip to the middle, and look at the name we land on. From there we know if our target is in the first half of the
book, or the last half of the book. We do that a few times, and eventually find the Johnson area, and within that we can find
Larry quickly. That’s the intuitive pattern to look for with logarithmic runtime - you’re cutting the search space in half (or in
eights, or whatever) each time. We didn’t have to look at every page - we only had to look at maybe six or eight pages.
O(n log n) is log-linear time
Log-linear is also pretty common. Its shape is almost the same as linear, except it grows very slightly more as the input gets
larger. Its shape reflects that, sitting just above the linear curve. We write it like O(n log n) and pronounce it as “oh of n log
n”).
I’ll use an admittedly dumb phone book example here. We’re going to do a mashup of names: for every first name in the phone
book, is there a Johnson with that first name? To do this we’ll have to look at every name in the book, so right there we’re
already at O(n). But for every name, we also have to look for a corresponding Johnson. And as we just saw from the Larry
Johnson example, looking for a particular person is logarithmic. And if we run a logarithmic operation N times, that is where we
get log-linear time.
O(n^2) is quadratic time
Quadratic time is when we start getting into explosive growth. There are others that are worse, but this is the one you’ll see.
The shape of this curve jets upward and gets steeper and steeper as you go. It is called quadratic because the shape of the
curve is the same as a quadratic equation, and the term that dominates the growth is n^2. So we write this as O(n^2) and can
either say “quadratic time” or “oh of n squared”.
Now for an unhinged phonebook example. Say that Law Enforcement has determined that there is a conspiracy of Larrys in our
fair city. So we need to make a diagram that relates each Larry with every other Larry, and then we characterize the
relationship between them so we can isolate the conspirators.
The algorithm here is: start scanning the phonebook for each Larry (which we know is O(n)) and when we find one, scan the
phonebook for all the other Larrys (also O(n)). Since we’re going to run an O(n) operation n times, we multiply those together
just like we did for log-linear, to get O(n * n), which you can also write as O(n^2).
Avoid factorial and exponential time algorithms

It is possible to have a really gnarly algorithm that is so resource intensive that the growth curve is actually exponential, or
factorial. For exponential growth, the input size n is actually in the exponent and we write it like O(c^n) for some constant c -
this isn’t something you see very often. For factorial time, written O(n!). Mostly the reason we learn about these time
complexities is to understand that it should be avoided.
I don’t have a phonebook example for this, partly because I couldn’t think of one, but mostly because these explosive growth
algorithms are rare. If you take a higher level algorithms class you’ll probably do analysis on exponential algorithms. But for this
class, we’re going to peak out at quadratic time.
If you do find yourself with a gnarly complexity on your hands, the only way you can realistically approach it is to find an
approximate, “good enough” approach, sometimes called a “heuristic”, that can give an answer within our lifetimes.
Next Up
So this episode was an intro to big oh notation, and how we can characterize an algorithm’s runtime or space usage in terms of
the input size, and we saw the shape of each of those curves. The ones you’ll regularly deal with (whether you realize it or not)
are constant, linear, logarithmic and log-linear, and quadratic. The ones you should run from in abject dread are the ones on the
left here, exponential and factorial.
Now we’ll look at some actual code examples for many of these different complexities.

### E02: Complexity Code Examples

#### Preamble
Remember the silly example of counting Larrys from the last episode? I can’t help myself - now we’ll write the actual code that
implements those routines so we can see what different complexity algorithms look like. The goal here is for you to start
developing a sense of how complex your own code is.
Constant time
If we want to find the page where a record is, and we know which page to turn to, we can do that without needing to think very
hard. We just access the page we need directly, and we’re done.
// O(1): we have all the information needed to get
// the answer immediately
```typescript
const findLarryOnPage100 = (
  pb: Phonebook,
```
): Page => {
```typescript
const larryPage = pb.pages[100];
return larryPage;
};
```
Instead of hard-coding that 100, we could pass in the page number to the function and use that number instead, but it doesn’t
change the complexity. This is an O(1), constant time operation because it doesn’t depend on the input size at all.
Next Build (Larry Page)
And for the record, I didn’t actually do this on purpose, but now that I’m writing the slides I realize that Larry Page is one of the
cofounders of Google. So there you go.

Logarithmic time
Now say we’re going to try to find the page where Larry Johnson could be found. The process for doing this with a phonebook
is like this. You remember which is the first page where it might be, and what’s the last page it might be, and look at the page in
the middle of those two. If you find your record there, cool. Or if you can determine that it isn’t there, you can stop. If not, use
the fact that the data is ordered by last name, and decide if you should look towards the front or towards the back of the book.
Keep doing this process a few times and you’ll get your answer quickly.
Next build - logarithmic time code
The code for that process might look like this:
```typescript
const searchForPage = (
  pb: Phonebook,
  minPage: number,
  maxPage: number,
```
) => {
```typescript
const idx = (minPage + maxPage) / 2;
const page = pb.pages[idx];
if (page.hasLastName("Johnson")) {
  return page;
}
const dir = page.dirForLastName("Johnson");
if (dir < 0) {
  return searchForPage(pb, minPage, idx);
```
} else {
return searchForPage(pb, idx, maxPage);
}
};
Every time we decide to look earlier or later in the book, we are cutting our search space in half. Say the phonebook was a
tome of a thousand pages. On the first time through, we’d check page 500 to find ourselves in the “M” names. So we look to
the front. But now we only have to consider pages 1 to 500 - half the original search space.
We pick the page in the middle, 250, and this is maybe an “H” name, now find that it is towards the back. But we know the limit
of the search space is 500, so we pick the page between 250 and 500, and again, we cut the search space in half, and we look
at page 375. You very quickly get to the right page using this approach.
Since the search space size is reflected with the number of pages, and we’re cutting the search space in half each time, the
number of rounds that we can expect to go is logarithmic. That thousand page book only needs about ten rounds of that
before we will find the answer.
Linear time
For linear time, I’ll just bring back the code from the last episode, with a small modification:
```typescript
function countLarrys(names) {
  let count = 0;
  let n = names.length;
  for (let i = 0; i < n; i+=2) {
    if (names[i] === "Larry") {
      count++;

    }
  }
  return count;
}
```
Linear time is pretty easy to spot - if you’re examining each element of an array, that is linear time. Even if you’re doing
something like this, skipping every other element, that is still linear time. You might be tempted to divide this in half and write it
as O(n/2). But with complexity notation, we omit everything except the dominant term, so this is still linear time, written as
O(n).
Log linear time
Now say we’re going to do the name mashup from the last episode - for every first name in the phone book, we want to know if
there is a Johnson with that first name as well.
We know that looking at every name in the book is linear time. And we know that checking for a particular first and last name is
logarithmic and you have to do that for every first name. So this is why we’d say this is a log-linear algorithm.
```typescript
const findNamesWithJohnson = ( people: Person[],
  pb: Phonebook ) => {
  for (let i = 0; i < people.length; i++) {
    const fn = people[i].firstName;
    const ln = people[i].lastName;
    // O(log n) to check for Johnson by this name
    const hasJohnson = pb.hasPerson(
      fn,
```
"Johnson",
);
if (hasJohnson) {
console.log(`Found ${fn} ${ln} matches`);
}
}
};
The for-loop there runs through every person in the phonebook. So that part is O(n). And inside that loop’s body, we’re running
the hasPerson check, which works by chopping the search space in half repeatedly until it either finds what we’re looking for,
or determines that it isn’t there. And that is an O(log n) operation. And since we do that each time through the loop, we have
to multiply log n by n, and that gives the overall complexity of O(n log n).
Quadratic time (Larry Conspiracy)
The O(n^2) phonebook example is the Larry conspiracy from last time. The Authorities believe there is a conspiracy of Larrys,
and we need to understand the relationship that each Larry has with every other Larry. We need to create a new record that
documents each Larry/Larry relationship, even if that relationship is that they don’t know each other.
To do this we have to examine each Larry, which is O(n), and then compare that Larry with every other Larry.
// O(n^2) algo due to O(n) outer loop with nested
// O(n) inner loop.
```typescript
const larryConspiracy = (people: Person[]) => {
  // outer loop is O(n)

  for (let i = 0; i < people.length; i++) {
    if (people[i].firstName === "Larry") {
      // inner loop is O(n)
      for (let j = 0; j < people.length; j++) {
        if (people[j].firstName === "Larry") {
          makeRelation(people[i], people[j]);
        }
      }
    }
  }
};
```
So we’ll have an O(n) outer loop, which has an O(n) inner loop. So just like with the log-linear example, we multiply those
together to get an overall O(n^2) runtime.
Next build - what about the conditionals?
You’ll notice that this code has some conditions in there, we have to test if the first name is Larry or not. And you’ll be tempted
to think that this affects the overall complexity, since most people aren’t named Larry. It is true that we probably won’t actually
have to do n^2 operations. But for the purposes of complexity notation, we can’t make assumptions about the data, unless
that is part of the invariant. For example if we know that the data is sorted, we can rely on that for the algorithm. But in this
case we have no guarantees about how many Larrys there are. Maybe we live in a crazy alternate universe where everybody is
named Larry.
Complexity of common algorithms
So now that we’ve introduced the concept of algorithm analysis and computational complexity, you should be able to relate
what we’ve learned to the data structures in your life. You may or may not have encountered these things depending on when
you watch this, so don’t worry if you’re not familiar with these things.
If you go on Wikipedia, every data structure you would likely use has its runtime complexity prominently documented. For
example, this is for Binary Search Trees. Most classic data structure’s operations will have an average and worst-case scenario
runtime complexity listed, often in a little box like this.
How to use big oh
So what is the practical importance of big oh?

When you’re just programming, you often need to devise your own data structures and algorithms. And when you do this, you
can remember the patterns that you learned back in your data structures class, and use that to guide your thinking about how
you might make a reasonably efficient algorithm that gets the job done.
It might be obvious, but I’ll say it: for large data sizes, a constant time algorithm will beat a logarithmic one, and that will beat a
linear one, and that will beat a quadratic. This does not mean that you should move heaven and earth to build the most
efficient algorithm possible. It just means that you have some analytical means to understand what you’re dealing with, and for
the sake of getting the job done, using an O(n^2) algorithm might be perfectly OK given the data you’re expecting and the
performance requirements.
In my personal experience, understanding big oh gives me a spidey sense that the code I’m writing is good or bad. Usually bad.
And when that intuition kicks in, I can do the math and make a judgement call if it is worth my time to come up with a better
strategy, or to accept that worse is better and spend my time on other things.

### E03: Complexity of common operations

#### Preamble
In this episode I’ll take a look at some classic data structures and their operations and show why they have the complexity that
they do. My goal here is to help develop your intuitive sense of how “hard” from an algorithm is. My goal is not to work up a
rigorous mathematical basis for doing algorithm analysis. If you continue on with computer science you’ll probably take a class
that involves that in more depth. For now, I’m focused on the practical importance of complexity.
AABB
An axis aligned bounding box is a simple structure that simply records the minimum and maximum extents of some geometry.
And we use it to detect possible collisions or intersections with points, lines, and other axis aligned bounding boxes. This isn’t a
classic data structure, but it is a good example of the kind of thing that you’ll use or build in everyday programming.
The data structure for this is simple: it just has two values for each dimension. So for 2D geometry, that’s just four numbers. It
doesn’t matter how detailed the underlying geometry is - we only ever have four numbers.
From a memory usage perspective, this is constant complexity, O(1).
AABB ops: collision tests
An AABB lets you test if a point, line, or other simple geometry intersects the bounding box. It doesn’t say for sure if the
geometry definitely intersects the underlying geometry - the idea here is to quickly check if such an intersection is possible or
not.
And these bounding boxes do their job! Intersecting points, lines, and other boxes with an AABB will involve a fixed number of
math operations, because that simple geometry is built from a fixed number of points, and the bounding box is also built from a
fixed number of points. So all of the operations for collision testing AABBs with simple geometry are constant time operations
as well, O(1).
If on the other hand you are testing if a complex object with arbitrarily detailed geometry collides with the bounding box, then
you will need to do more work, and that depends on the size of the complicated geometry. Probably linear time, O(n) - but this
is abusing the purpose of an AABB in the first place.
Linked lists
A classic singly-linked list has this long shape, with each node connected to the next. Each node contains one record, so to
store n records we need n nodes. So the space complexity is O(n).

Linked list operations
We draw linked lists like this for our benefit, but from an algorithm’s perspective, it only can “see” (airquote see) what it has
references to. And that’s the case with any other data structure and algorithm. I say that because we can perceive the whole
thing in a diagram and that tricks us into thinking things that aren’t true.
For example, one linked list operation is to find a node. But all we have to work with is a reference to the first node, and to
examine any other nodes we have to follow each link. And to examine each node, we have to follow all the links. So, finding a
node in a linked list is linear, O(n).
Most linked list operations involve finding the right spot to do its thing - and I’m mostly thinking of inserting or removing data.
Once you’ve found the right spot, and you have a reference to what you need, those operations are constant time. But in order
for those operations to work, we first have to find the right spot, and like I just said, finding things in a linked list is linear time.
So this practically means that remove, insert, and append all end up taking linear time because those routines need to find the
right spot first.
Fancier linked lists to improve efficiency
One exception to what I just said is inserting or removing from the front of the list. In those cases we already had a reference to
what we are looking for, so we don’t need to run the linear find process at all, so working with the beginning of the list is
constant time.
Knowing that, you can build fancier linked lists that hold more information to avoid scanning the entire structure to find the spot
you need. The most common one is a list that also keeps a reference to the end of the list, since we often want to add and
remove from the end of the list, not the beginning. So in that somewhat fancier list, appending to or removing from the back of
a list becomes constant time as well.
The downside to that is just that the data structure becomes slightly more complicated by adding the invariant that the
structure always keeps a reference to the last node or two.
Binary tree
A Binary tree structure also uses nodes and references, but it has this shape. There’s a node at the top, and all nodes can have
up to two child references, called left and right. So if we have n records to store, we need n nodes, and this has O(n) space
complexity.
Binary search tree
If we impose the rule that the left side will hold smaller values than the parent, and the right side has all the rest, then we can
treat this as a binary search tree, because that rule will improve the complexity substantially.
Subdivision → logarithmic complexity
Remember my phone book example from earlier: Phone books are sorted by last name. If we’re looking through a phone book
to find somebody, we can find the right page in only a few steps by splitting the search space over and over.
If our phone book was stored in a binary search tree, and the root node holds “Miller”, we can use that to ask the question: Is
“Johnson” in this half or that half?
Next build
OK, split that half in half, and we happen to find the next node is “Franklin”. Now ask if “Johnson” is on the left or on the right?
Next build

“Johnson” comes after “Franklin” so we go to the right. And just to end the suspense, maybe we find “Johnson” next, so we’re
done.
Next build
The phonebook could be literally a billion pages and we’d find the right page in 30 steps or less. There’s an asterisk to this,
because this only works if the tree is balanced.
Just wanted to remind you of that, because this subdivision is exactly what binary search trees are about. And there are lots of
other trees that play the same trick.
Whenever you see that something cuts the search space by some fixed factor every time you take another step, you’re talking
about logarithmic complexity.
Binary search tree operations
As for specific binary search tree operations, these are the usual suspects: find a node, insert a node, and remove a node. All of
these operations use the same subdivision property, so they’re all logarithmic.
Asterisk
Earlier I mentioned that logarithmic runtime is only guaranteed if your tree structure is balanced, meaning the left side and the
right side of each parent node is basically the same size. But, it could be really imbalanced. Like if I make a binary search tree
from sorted data, I’ll end up with a ‘tree’ that really looks like a linked list. And in that case the actual complexity for finding
something is the same as a linked list, which is linear.
For this reason people have developed fancier trees that have invariants that keep the tree balanced so you actually have
guarantees that operations are logarithmic like you want them to be.
Final thoughts
So, now I’ve just introduced the concept of complexity - space complexity and time complexity. Doubtlessly you’ll do a web
search for the data structures we’re working with and you’ll see lots of talk of complexity, so you now know generally what this
is about.
If you ever apply for a software developer job, they’ll probably ask questions about complexity, probably because those kinds
of questions have right and wrong answers. So the cheat sheet here is:
- O(1) constant time when the number of steps doesn’t depend on the input size.
- O(log n) logarithmic time when you’re dealing with subdivisions like the phonebook.
- O(n log n) when you’re doing a logarithmic thing for every item in the data set.
- O(n) when you’re doing a constant time thing for every item in the data set.
- O(n^2) when you’re considering every item in the data set with every other one.
The more important thing, speaking as somebody who writes code for a living, is that you internalize the idea of complexity and
```typescript
let it be one thing among others that intuitively helps you write better code.

```

### S02: Linked Lists

#### Preamble (Sequence)
This sequence is about how to work with reference variables. In lots of languages like Python, Javascript, and Java, referential
variables look and behave almost exactly like value variables. In languages like C and C++, the distinction is a bit more obvious
because we the programmers have to work directly with memory. However, in Javascript and the like, references are still there,
and in order to use them effectively we have to understand the nuances of how they work.
Throughout this sequence we’ll be looking at the Linked List data structure as a way of studying referential data. With Linked
Lists, you have a sequence of nodes, and each one has a reference to the next item in the list. So we’re going to start by
looking at references, and how they work in languages with different memory paradigms.

### E01: References & Pointers

#### Preamble (Episode)
This first episode about making the distinction between the values of data, and references to that data. And this can be
confusing because a value can be a reference, and different languages can have fairly different ways of letting you work with
referential data.
What are references?
We use references all the time. People have names, products have serial numbers, students have ID numbers. Those names
and numbers aren’t the actual people or things, but they do refer to them. And this is very convenient, because it means we
can just use the name or number in conversation, instead of physically bringing those people or things into the room.
References in programming languages
We do the same thing with data. Most programming languages that I’m aware of have a concept of a reference. For example of
how we’d use this, think of a fancy 3D video game when we might load the data related to a something, a monster or whatever,
and it textures and geometry. Lots of data. And when we want to use that data, for various reasons we don’t want to copy that
huge thing around all the time. And we don’t need to! We store the object in memory somewhere, and then refer to it.
References are small. We can have lots of them, and we only need to have one copy of the object in memory.
Pointers
Many languages give you direct access to the computer memory that is used to store data. When I teach this class in C or C++,
we will spend a good amount of time talking about how we acquire memory, how we can read or write that memory, and how it
is our job as the programmer to clean up after ourselves when we are done using memory.
While Typescript and Javascript don’t have a concept of memory pointers, they do use references heavily. So this next example
in C++ is meant to show you what it looks like when you have direct memory access.
C++ example of pointers
```typescript
#include <iostream>
```
using namespace std;
int main() {
// andy's type: integer. value: 42.

int andy = 42;
// ted's type: pointer-to-integer. value: address of 'andy'.
int* ted = &andy;
}
Here we’re declaring an integer named andy and and giving it a value of 42. This means the program is grabbing a little spot in
memory and writing to it. You’ve seed this sort of thing before. But the next bit might be new to you.
Next we declare a variable named ted, and that one’s type is “pointer to integer”. It isn’t an integer, it is a reference to some
other spot in memory that is expected to hold an integer.
Then on the right hand side, we have that funny ampersand-andy thing. That syntax in C++ means to take the memory address
of the andy variable. So we’re taking andy’s memory address and putting into the ted variable.
C++ data values and references
```typescript
#include <iostream>
```
using namespace std;
int main() {
int andy = 42;
int* ted = &andy;
cout << " andy: " << andy << endl; // 42
cout << "&andy: " << &andy << endl; // 0x7fff508455bc
cout << " ted: " << ted << endl; // 0x7fff508455bc
cout << " *ted: " << *ted << endl; // 42
}
So once we’ve established andy as storing the value 42 and ted storing the memory address where andy is stored, we can
take a look at what is actually stored in memory.
The lines with cout there are just printing out values. And indeed, andy has the value 42. But then the next two lines are
funky! When we print out ampersand-andy, or just ted we get that weird zero-x-7-f-f thing. Believe it or not, that’s a number
which is the memory address in the computer’s memory. And that number is the value of the ted value. So values can be the
data we care about, or values can be references to data we care about.
And this is useful because you can use a reference or a pointer to read and write to the data on the other side of the reference.
This class - not covering memory pointers
Often, a data structures class like this will explicitly choose a language that gives the programmer direct memory access so we
can better understand how memory works. So languages like C, C++ and Rust are good options there. And if you’ll ever
program for microcontrollers, little chips in embedded systems, or work on optimizing video games or robotics, you will
probably want to learn those languages.
But for this class, we’re taking the position that working directly with memory isn’t necessary to understand the fundamentals
of data structures. The important thing is that data can refer to other data.
References in Javascript & Typescript
In this class we’re using Typescript, which is essentially Javascript with some added syntax to support compile-time type
information. So the rules around references for Typescript are the same as they are for Javascript.

```typescript
const passingVarsExample = (
  thing: MyThing,
  otherThing: MyThing,
  num: number,
```
) => {
// modifies original argument because we write
// to a property of an object, which was passed
// by reference
thing.color = "blue";
// does NOT modify original argument because
// we're reassigning the variable
otherThing = { color: "red" };
// doesn't modify the original because numbers
// are only passed by value
num = num + 1;
};
In Javascript, when you pass data in to a function, primitive types like strings and numbers are all passed by value. This means
the Javascript interpreter makes a copy of the data and gives that to the function. In contrast, there are “reference types”,
which means they are always passed by reference.
Next Build
So in this example here, our function gets three inputs. The first two are objects, which are passed by reference, and the last is
a number.
Next Build
First when we use thing, we are changing it’s color property to blue. We’re not modifying the thing reference itself, but just
a property in the object it refers to. See the dot that separates thing from color? I like to imagine that little dot as a kind of
portal that we use to reference the original data. And because that little dot lets us modify the original data, that change will be
visible outside of this function.
Next Build
But when we use otherThing, we are re-assigning its value entirely. When we do that, it only changes the local reference to
otherThing and the change will not persist outside of the function. Notice - there’s no dot involved here, so we’re not using the
reference, we’re reassigning our local copy of it.
Next Build
It works similarly to the last part, where we reassign the value of num. Numbers are primitive values so we are always working
with a copy of the original data.
Reference types vs primitive types
The reference types that you’ll work with in Javascript are: objects, arrays, and functions. Whenever you pass a reference type
as an argument to a function, it is possible that the function will modify the properties of that complex thing. And often this is

what you want!
The primitive types are essentially all the rest: numbers, strings, booleans. If you’re passing in one of those primitive types to a
function, whatever happens to them inside the function won’t be visible outside of it.
Empty references?
What if you want to say “this variable doesn’t point to anything”? We need a special “not a value” value. For some reason this
always makes me think of a black hole.
If you’re working with numbers, and you want to represent ‘no value’, we often use zero. Other primitive types have other
reasonable values. But what is the ‘no value’ value for references? In Javascript we use the keyword null, which has a special
‘no value’ value. Most languages have this concept, and they might have slightly different words for it.
So if you want to indicate that a reference doesn’t refer to anything at all, you can use null.
JS null example
// declare a variable that can either be a Car
// or the special 'not a value' value, null.
```typescript
let car: Car | null;
// can set car to null if we don't have one
car = null;
// if we get a car, we can assign it thusly
car = {
  make: "Saturn",
  model: "SL-2",
};
```
In this example, we have a variable car that can either be a Car value, or null. You can reassign that variable to the empty
null value or any other legitimate, non-null value.
Using references in data structures
Often data structures contain references to other data structures. In this sequence we’re going to look at Linked Lists, which
are built out of Linked List nodes that have references to other nodes. So if you have a reference to the first node in a list, you
can follow each node’s reference to get to the next one, until the reference is empty.
```typescript
export interface LinkedList {
  data: number;
  next: LinkedList | null;
}
```
The Typescript definition looks like this. In other languages it is similar. You declare a type, and I just called it LinkedList.
Inside that type, its next property has that type as well. The next property can also be null to indicate there is no next item.
Next: Linked lists
So now that we’ve introduced the concept of references to data, we can take a look at the Linked List data structure - how
they’re built, and what we can do with them.

### E02: Linked Lists

#### Preamble
Linked lists are simple data structures that store sequences of data. You’ve probably worked with lists or arrays already as
you’ve learned to program, and Linked Lists are meaningfully different from those things in important ways. In some languages
like C, when you make an array you must know in advance how many items it will contain. In other languages like Javascript,
elements of an array are essentially independent of one another. But with a Linked List, each item references the next in a
sequence. This makes it easy to join and split lists in ways that are often exactly what you want.
Uses of linked lists
To be fair, in the real world it is not often that the solution to the problem at hand is to use a Linked List. But aside from the
academic purposes of Linked Lists, they actually can be quite useful.
I’ve mentioned that each linked list node refers to the next in a sequence. This means you can make chains of data into
sequences for some purpose, and you can work with the entire sequence if you have a reference to starting node. For example,
a node might represent a song, and a linked list might give you a playlist - a sequence of songs in a particular order.
Use #1 - joining lists
Say we have two linked lists for two playlists. Side one and side two of an LP or something. For each list, the last node points to
null, which means the end of the list. But one neat thing about linked lists is that you can
Next Build
join them together by having the end of one list simply refer to the beginning of the next list. All that is needed is to update one
reference!
Use #2 - splitting lists
Here’s another use case. We have one long list represents scenes in a movie, or a DNA sequence, or temperature readings over
the course of a day.
Next Build
Whatever it is, we might want to split it into shorter lists. To do this, we just find the last node before the split point.
Next Build
Then record where the next list begins, and update the split point’s next reference to point to null, drawn with those three
green lines.
Linked lists are for sequences
Linked lists are especially useful when sequence is the important property of the data. In these situations It doesn’t necessarily
matter that a node is at index four or five or whatever, it only matters that it comes directly after one thing, and leads directly
into some other thing.
Building linked lists
Here’s a definition for a linked list node in Typescript:

```typescript
export interface LinkedList {
  data: number;
  next: LinkedList | null;
}
```
To recap, this is a simple node that holds a number for data, and has a reference to the next linked list node in sequence, or
null if there isn’t one. That data field could be anything we want it to be, and in the real world you’d probably make that data
type adjustable to whatever you need. The important thing here is that we have data, and a reference to either the next node if
there is one, or null if not.
Depicting linked list nodes
It is really helpful to draw pictures of whatever data structures you’re learning or working with. This will be very useful when
you’re working on the homework and trying to figure out what to do with all your references.
A sequence of linked list nodes looks like this. We draw arrows from the link to the next item. The last node in the list points to
null, which you could draw in many ways. I tend to draw it like a ground symbol from electronics, because why not? You could
draw a zero, or write the word null or nil or none - however you want.
Notice I also have references that point at specific nodes here. The start reference represents the entry point to the whole
list. You can also call it root or head or top or first - you get the idea.
And as we’ll see later when we get to some implementation tips, you’ll also need to have some record-keeping variables that
point to nodes in your list. You’ll probably have references to a cursor, and previous, meaning the node-before-the-cursor.
Empty list
If the list contains no data at all, that first reference itself is to null.
Linked list operations
As with just about all data structures, there’s some standard things that go along with them: how to make a new thing, how to
add to and remove from it, how to query it, and so forth. Often these operations have conventional names and that’s true with
linked lists as well:
- Initialize - make a new linked list
- Append - add data to the end of the list
- Insert - place data at any location into the list
- Get - retrieve data based on some query, like an offset
- Remove - take data out of the list
- Find, aka Contains - locates data in the list, if it is there
- Size, aka Count - computes the length of the data
Many structures use these words in similar ways. Other structures support operations with conventional names that don’t apply
to linked lists.
Next Up
There’s enough to think about with these linked list operations that we can break up the work into a couple episodes. However,
before we get into the specific linked list operations, I want to take a brief detour and talk about a couple important related

ideas with data structures, and writing good software generally: contracts and invariants.

### E03: Contracts & Invariants

#### Preamble
This short episode is about code contracts, which is a strategy for you the programmer in planning what you’re about to do,
which doubles as an agreement with whoever uses your code that spells out what it will and won’t do, and who is responsible
for what.
Preconditions
First up are preconditions. Preconditions are rules about the starting condition for some code. It often takes the form of rules
for the inputs to functions, and what state their data is in. Like, can numbers be negative? Or zero? Is there an upper limit? In
the case of a data structure, what can we assume about the data structure? Is it guaranteed to be initialized, or meet other
criteria?
Postconditions
Postconditions are the rules for the outputs, or ending state of some code. For functions, postconditions are often about what
kind of data is returned, and what we can expect from those: like can a return value be negative, zero, or up to some upper
limit? This is also about what state changes our code is allowed to make while we do our thing: are we allowed to have side
effects? Like writing to a file or changing a system variable? Or is the function a wholly-contained black box whose only effect
is to return a value?
Invariants
Last, there are invariants. These are rules that must be enforced about the condition of the data. You can think of preconditions
and postconditions as being invariants. An invariant might impose a requirement that the data structure always obey, even
when you’re performing a mutation operation to it. Or, an invariant might relax a bit and require that your data structure must
obey the rule by the time you’re done working with it.
Non-code example
Here’s a non-code example. Say we’re helping somebody cook a fancy dinner and they tell us “stay at the stove and prevent
the mirepoix from burning. Let me know when the onions are translucent. And don’t accidentally turn off the oven.”
So here we have a couple preconditions: there’s mirepoix on the stovetop, and the oven is presumably on. Postconditions are
that we’ve not let anything burn, we’ve told the chef that the onions are translucent, and the oven is still on. This instruction
doesn’t say anything about how we should prevent burning: we could use a spoon, or we could do one of those chef moves
where we toss everything into the air repeatedly. Or maybe telekinesis?
Code example
Here’s a code example of coding by contract. Take a look at the documentation and see if you can figure out what the pre and
post conditions are. I’ll just read it to let it soak in: create a new Person instance that is equivalent to the input Person, but their
age has been advanced by the given amount. The input person is not modified.
```typescript
/**
* Create a new Person instance that is equivalent
* to the input Person, but their age has been
* added by the given amount. The input person

* is not modified.
*/
function getOlderPerson(
  person: Person,
  amount: number,
```
): Person {
return {
name: person.name,
favoriteColor: person.favoriteColor,
age: person.age + amount,
};
}
Code example contract
The English documentation here could have been more concise, right?
The precondition is that we’re receiving a person object that has some fields, and a number. It doesn’t actually say anything
about the incoming values. Can the input person be null? What about a negative amount? Or zero?
The postcondition is that we return a new object entirely, and it should be just like the input person, except we’ve added some
amount to their age.
The invariant is that we do not modify the input person object at all - so we can’t just add the amount to the input person and
return that! We have to return a new thing and leave the input person alone.
Aside: naming things is hard
You might have caught some weirdness with this function specification. The documentation says nothing about the amount
value - it could be zero, or negative. But the function name itself says getOlderPerson. If negative amounts are allowed,
doesn’t that contradict the name?
This seems pedantic, but lazy language like this is a big source of bugs. It would be better for either the precondition to specify
valid aging amounts, or for the name to be more accurate, or both.
Why contracts matter
There are lots of reasons to think about and write out your obligations for writing code. If you’re working with others, you’ll likely
use design-by-contract or some similar approach for breaking down the work and defining how the pieces should work
together.
Even if you’re just working by yourself, thinking about functions as contracts will help you think through exactly what you’re
doing, about the full range of inputs and outputs, and what could possibly go wrong.
Writing out code contracts can be a great starting point for documentation. If your language gives you tools for spelling out
contracts in compile-time enforceable ways, I encourage you to use them! This is one reason why I prefer type safe languages
like Typescript.
Next up: Linked list operations
So now that we’ve talked a little bit about the idea of planning your implementation approach by using code contracts, we can
apply that strategy on the linked list operations in the next episode.

### E04: Linked List Operations

#### Preamble
In this episode we’re going to cover several linked list operations from a high level. You’ll implement these for the homework.
Linked list operations
This is the list of operations that you’ll implement for the homework. In the real world, there are other operations that you’d
likely want, but for our purposes this list should suffice.
- init - make a new list
- report - debugging function to print out contents of a list
- append - add data to the end of the list
- insert - place data at a particular offset
- size - get the size of the list
- contains - checks if the list has a specific value
- get value at offset - gets a value if the offset is valid
- remove - change the list so it no longer contains specific data
Initialize an empty list
Remember this drawing of an empty list? If we need an empty list, all we have to do is initialize a LinkedList reference to
null.
Initialize a list with data
If you need a new linked list node that has a particular value, use an initList function like this:
```typescript
const initList = (data: number): LinkedList => { ... }
```
Thinking about preconditions: do we want to have any limitations on the input data? In our case, it doesn’t really matter. Any
number value is OK.
What about postconditions? Well, the most obvious one is that we’ve initialized a node with the given data and returned it.
Anything else?
Initialized node diagram
Drawing out the initList code as a diagram, it might look like this. Hmm, the next reference should be null! Seems so
obvious when we have a picture, doesn’t it?
Append
Now we’re getting into more interesting territory. The append function looks like this:
```typescript
const append =
```
(list: LinkedList,

data: number): LinkedList => { ... }
This function takes a linked list, and some data that we want to apply to it. And it also returns a linked list. Why is that?
This and the other functions that mutate the list structure will return a reference to the first node of the linked list, after the
operation has completed. This is needed because the mutation might actually change which node is the first node.
Append diagrams
For example, if we append data to an empty linked list, we need a way to refer to that first node after the append function is
complete. So - we return a reference to it. The input list value is null, and once we’ve made our one-node list inside the
function, the only way for that reference to be useful is if we return it. From there it is the calling context’s job to update the
reference.
If you’re used to an object-oriented approach, and this seems weird to you, don’t worry! This is just one possible way of
working with data structures. We’ll change it up throughout the course to use different approaches, like with container objects,
and maybe even classes.
Append diagram for non-empty list
If the input list isn’t null then we have to find the end of the list. We’ll initialize a node like we’ve talked about, and have the
end of the list refer to it. And always remember that you have to return a reference to the first node in the list.
Insert
When we insert data, we’re given the list and data as before, but also an offset. We’re going to make a new node that will be
placed into the list so that it lives at the given offset when the process is all done. And then we return the start of the list, which
might be different if the offset was zero.
You will need to develop the skill for drawing the operations in diagram form. You’ll need to identify various cases like how to
handle empty lists, or what to do when the offset is zero, or something else.
```typescript
const insert =
```
(list: LinkedList,
offset: number,
data: number): LinkedList => { ... }
Next Build
Here’s one possible case where the list has some data in it, and we need to place new data at some non-zero offset. I’m
showing you hand-made drawings here as a subversive attempt to make it easier for you to do it - I know some people have a
hard time putting pencil to paper, so just go for it!
Draw a picture of the state of the list to start with. Then try to work within the rules to transform that initial state into the one
you want.
Next Build
In this example, we want a node with value 42 to end up at offset one. So draw a new node - and in code you’ll make this with
the initialize function - sort of near where it should go. Now looking at this, you can see you’ll need to adjust the reference at
the previous offset to refer to your new node. Every time you make a new box, or move an arrow, that’s going to correspond to
some code you’ll write.

If you’ve annotated the sketch with things like the offset, also remember to adjust those if the situation changes as it does
here.
Size
So, size. I’m going to speed up a bit here, because my goal is to give you some practice making your own drawings. I’ll show
what I did, but not necessarily talk it out.
```typescript
const size = (list: LinkedList): number => { ... }
```
The size function just counts the number of elements that are accessible from the starting node and returns that number.
Contains
```typescript
const containsValue =
```
(list: LinkedList,
value: number): boolean => { ... }
The contains function returns true if any accessible nodes in the list have the given value, and false if not.
Get Value
```typescript
const getValue =
```
(list: LinkedList,
offset: number): number => { ... }
The getValue function is sort of like an indexed access in a traditional list or array, often written with square brackets like
someList[i]. Our linked lists don’t support that syntax, but we can write a function for it! It takes an offset, and all we do is zip
along a list that many steps. If we can’t, like if the list isn’t that long or if the given offset is negative, the documentation says to
return the special “not a number” value.
Removing first node
There are a few use cases for removing data.
The first case is that we want to remove the very first node, at offset zero, which means the return value will be to a different
value than what was passed in.
Remove last node
The second case is that we want to remove the very last node. This just means we scan to the end, and set the second-to-last
node to point to null.
Remove nodes by offset
The third case is the generalized case where we are asked to remove a node based on an offset. You might consider letting this
```typescript
function do the work for the other two - the trick is to send in the right offset.
```

Be careful that you return a reference to whatever the first node in the list should be. What should you do if the list is now
empty? How do we model an empty list? With null, in this case.
Next: some implementations
This episode has been a sort of graphical tour of how you might depict your data structure in different operations like inserting
and removing data. I took the time to do a full episode on this because from experience it seems to me that to students who
learn to make sketches to help them reason about what is going on tend to get way way more out of this class.
So now that I’ve gone into some detail on that, the next thing is to translate those sketches into code. We’ll cover a few of the
operations that you’ll need for the homework, or at least some of the little patterns that will help you get to the finish line.

### E05: Init, append and report

#### Preamble
This short episode covers how to approach implementing the initialization, append and report functions.
Initialize a list node
A list node is simply a LinkedList object that has some data value, and points to the next item in a list. But for a new list, we
only have a single node. So the way we implement the initialize function is to create a node, set up the data and nulled-out
next reference, and return it.
```typescript
const initList = (data: number): LinkedList => {
  // all we need to do is create a new node
  // that has the given data with a next
  // reference of null. We can do this on one
  // line if we want, but for clarity, I use 4.
};
```
Next Build
Like this:
```typescript
const initList = (data: number): LinkedList => {
  return {
    data,
    next: null,
  };
};
```
So now, any time we need to make a new linked list node, we can just use the initList function.
Append
Here’s the signature for the append function:
```typescript
const append =
```

(list: LinkedList,
data: number): LinkedList => { ... }
The idea here is to create a new LinkedList node and add it to the end of the given list.
What are the possible input conditions? What can list be? It can either be null, or it can have data.
Appending to an empty list
If it is null, what should we do? Well, we need to create a new linked list node based on this data. But there’s no existing list to
append to. So, this new node will be the only item in the list, and a null reference to the next item. And then we return it as
the new start of the list.
Remember a minute ago when I said that we can just use initList to create new linked list nodes? Well if we’re appending to
an empty list, we can just return the result of initList with the input data:
```typescript
const append = (
  list: LinkedList,
  data: number,
```
): LinkedList => {
if (list == null) {
return initList(data);
}
// ... rest of the implementation here
};
Appending to a non-empty list
If instead we get a non-empty list in our append function, we have to find the last node, and then adjust it to point at our new
node.
Let’s say we knew for sure that list had three items in it. In that case, we could just write:
```typescript
const lastItem = list.next.next;
```
That’s because list is the first item, list.next is the second item, and list.next.next is the third item. Since in this
example we know that the first two references are valid, we can just chain together the parts with dots.
Next Build
But in reality we don’t know how many items the list has. But we can still sort of chain together the object references with dots,
using a cursor variable and a loop:
```typescript
let cursor = list;
while (cursor.next != null) {
  cursor = cursor.next;
}
```

You will use a variation of this pattern in nearly every function for the homework. In this case, we know that the list reference
isn’t null, since we’ve checked for it earlier. So we make a cursor variable, and use it to cruise through our list. In this
situation, we want to stop on the last non-null item, so our loop’s stopping condition is when cursor.next becomes null.
Next Build
Once we’ve stopped, we have a cursor variable that is a reference to the last item in the list. So now we only need to have it
point to a new node that contains our data. And since that will be the last node in the list, it’s next reference has to be null.
cursor.next = initList(data);
Next Build
Last but not least - remember what the function is supposed to return! All of our mutation functions have to return a reference
to the start of the list. So we simply return it.
Next Build
Here is how I implemented the append function.
```typescript
const append = (list: LinkedList, data: number): LinkedList => {
  if (list == null) {
    return initList(data);
  }
  let cursor = list;
  while (cursor.next != null) {
    cursor = cursor.next;
  }
  cursor.next = initList(data);
  return list;
};
```
So this has all the parts. We check to see if the input list is empty by checking if it is null. If it is, we return a newly initialized
node with our data. If it isn’t, we use a cursor variable and a loop to scan ahead to find the last node. Once we find it we have it
point to a new node with our data, and return the original starting point for the list.
Report function
The report function is just a debugging utility that will give us a string that we can print out to read what the linked list has for
data. It has a signature that looks like this:
```typescript
const report = (list: LinkedList): string => { ... }
```
There’s more information in the homework file, so be sure to always read the function’s documentation. Anyway, here we’re only
receiving a reference to a list, and we’re expected to create a string that has the list data, separated by spaces.
I can think of a few ways that we could implement this, so if the way that I do it doesn’t match the way you though of doing it,

by all means go ahead and try your way, and I bet you can get that to work just as well.
Next build
First we need a buffer to store a working result in. Since I’m going to overwrite this value later on, I use the let keyword to
declare it, rather than const.
Next build
Next, I want to march through the list nodes so long as they’re not null. To do this I’ll use the trick from earlier, where I make a
cursor starting at the top of the list, and use a while loop to iterate until my stopping condition. In this particular case I want to
stop once the cursor has become null.
Next build
Inside the loop, this is my big chance to add each node’s data to the result buffer. I did read the directions closely, which is rare
for me I suppose, and they mentioned that the data has to be separated by a single space character. So that’s why I’m also
adding on the space.
Next build
Once the loop ends, we’ve looked at all of the items. So I’m just returning the buffer. But, note the .trim() part - this removes
the trailing space character. If you don’t do that, it won’t pass the unit tests.
Parting words
So that’s it for the implementation episode, and actually that’s a wrap for the linked list sequence as a whole.
Remember, this course is about giving you a way to develop your own intuitions about how to craft algorithms and the data
structures that support them. These first few data structures are here to help give you a well-understood starting point for
building data structures in code, so that by the end of the course you’ve built mental models for tackling new and interesting
problems.
Keep that in mind as you do the homework. I’m sure Chatbot can ace this homework, and that’s totally not the point, and it is
actually counterproductive because you won’t be building the intuitions in your own mind.
That said - good luck with the homework!

### S03: Binary Search Trees

Sequence Preamble
This is the next sequence in the data structures and algorithms course! This is meant to follow the last sequence, which was all
about references, and we explored this by implementing a linked list data structure.
In this sequence, I’m going to introduce the concept of recursion and explore it by implementing a data structure called a binary
search tree.

### E01: Recursion

Episode Preamble
In this first episode we’re going to start talking about recursion.
Recursion, n: see Recursion
Recursion is another tough concept, but fortunately it lends itself to some humor. I’ve had programming books with this in the
glossary.
Ummagumma
Recursion is all around. Any time you see a structure where that same structure is repeated (with variation) within itself, that’s
likely a kind of recursion too.
Code Example (for reals this time)
A recursive function is one that calls itself. Different invocations of the function have their own local variable scope, so they are
effectively separate. As an example, consider this pseudocode that sums up all the numbers that are less than and including
some input number:
```typescript
function addItUp(num: number) {
  if (num > 0) {
    return num + addItUp(num - 1);
```
} else {
return 0;
}
}
Different invocations of the function have their own local variable scope, so they are effectively separate, even though the
```typescript
function has the same name. In this example, the function sums up all the numbers that are less than and including some input
```
number. I’ll run through this example with code first, and after that I’ll show a different representation of all of this, in case that
makes more sense to you.
Next Build
Say we invoke addItUp with an argument of 6.
```typescript
function addItUp(num: number) { // num = 6

  if (num > 0) { // 6 is larger than 0, so take this branch
    return num + addItUp(num - 1); // 6 + addItUp(5)
```
} else {
return 0;
}
}
If we get a six, the code first checks if num is larger than zero, which it is, so we follow that branch of the if-statement. There,
we see that line to return num + addItUp(num - 1). This is the part that makes the function recursive - it calls itself! But really
what’s happening here?
This addItUp call can’t complete yet, not until it computes addItUp with an argument of five. So, this invocation will hang out
as another separate invocation finishes. So let’s see what that looks like.
Next Build
```typescript
function addItUp(num: number) { // num = 5
  if (num > 0) { // 5 is larger than 0, so take this branch
    return num + addItUp(num - 1); // 5 + addItUp(4)
```
} else {
return 0;
}
}
... it looks exactly the same! Except instead of an input of six, we have an input of five. And we follow the same logic, and it
again gets to the recursive call where it returns five plus whatever addItUp with an argument of four is.
Next Build
It does this until it gets to a stopping condition.
```typescript
function addItUp(num: number) { // num = 0
  if (num > 0) { // 0 is NOT larger than 0!
    return num + addItUp(num - 1);
```
} else {
return 0; // so use this branch
}
}
That’s when the input is zero, so we follow the second branch where it simply returns zero.
Then each recursive call that was waiting around finally gets its answer. addItUp with zero returns zero, addItUp with one
returns one plus zero, addItUp with two returns two plus one plus zero, and so on.
So the final result of calling addItUp with six ends up simply being six plus five plus four plus three plus two plus one plus zero,
which turns out to be 21.
When is recursion used?

Recursion is a ubiquitous concept in computer science, programming, and math. And even though this is another brain-melty
concept, once you get the hang of it, it will be second nature, and it is a super duper powerful tool to have at your disposal.
Recursion is typically used to address problems that can be either predictably subdivided, or if a solution can be transformed
into a simpler case for which the solution is known.
It is used in lots of situations: data structures, parsing programming languages, data mining and machine learning, not to
mention all the mathematical uses.
Heuristic for recursion
When you're writing a recursive function, the trick is to determine which of the following three states you're in:
1. We're in a state where we can complete a task and return. So: do the work and return.
2. We're in a state where we know we can't complete the task based on the information we have. So: return, either nothing or
with some kind of message that we got stuck.
3. We're not yet in a state where we can return, but it is possible the answer is 'downstream', where we can use information
we have to recurse deeper. So: break the problem apart and recurse, possibly using the results from the recursive call to do
work and return.
Add it up (again)
In other words, when we're in a recursive function, ask if we're done, or if not, can we subdivide our problem into one where the
solution is known or at least might be achievable?
Let’s go back to addItUp but this time I’ll show it a bit differently. The idea is exactly the same as earlier - just a different telling
of the story.
With the addItUp example, the first time the function is called it has an input of 6. We can't directly answer, but we do know
the answer is six plus whatever the result of addItUp(5) is. So we recursively call addItUp with 5.
Then we're in addItUp with the input of 5, and sort of like last time we know the answer is five plus whatever the result of
addItUp(4) is.
This continues until eventually we invoke addItUp with zero. In this case we can stop recursing and and can return a value.
And we happen to return zero.
Next Build
Now all the other calls to addItUp that were waiting for a response has something to work with, in the reverse order they were
invoked. addItUp(1) was waiting to add one to whatever addItUp(0) returned, which ended up zero. So addItUp(1) returns
one, and addItUp(2) now has it's answer. This process continues until the original call to addItUp(6) returns 21 .
Coming up we'll use recursion in our this sequence’s data structure, binary search trees. But first, I want to talk about the
general idea of trees before we get to the binary search tree structure.
Oh, and if you’d like more information on recursion, please see episode 1.

### E02: Trees

#### Preamble
This episode is all about an abstraction called Trees.
Normal person trees

Trees are great! For normal, reasonable people, they grow up, out of the ground, so that’s how we draw them.
Computer scientist trees
Computer scientists love trees. But instead of the kind that grows up from the ground, computer scientists draw their trees
starting from the top, and grows downward.
A tree is used to model hierarchies. Trees are built out of nodes and links, sort of like linked lists. Except with trees, nodes can
have zero or more child nodes.
Tree structures lend themselves to recursive operations because of their self-similarity, which we're going to talk about in the
episode after this one.
Trees model hierarchies
Here's a tree that models some organisms. This particular tree shows a hierarchy of supergroup / subgroup. For example,
humans are animals (some more so than others), and animals are organisms. And according to this tree, humans aren't plants,
or fungus.
Drawing trees
You can draw a tree node like this. The box has a value in it, just like our linked list node did. But instead of one link to the next
node, a tree can have many more links than that. This particular node has two links, both of which are null in this drawing.
And since there are two, we call it a binary node, and trees built out of binary nodes are binary trees. If our node had four or
eight children, they'd make quad or oct trees.
Next
By convention, we don't draw the null links, partly because you'd run out of room or they'd clutter things up. Just keep in mind,
those null links are still there - that’s how we indicate that the link doesn’t lead anywhere, just like linked lists end with a null
reference, binary trees have null references.
Tree terminology
Just having two links instead of just one lets us have some interesting structures and relationships between nodes.
An empty tree has no nodes. If the tree does have at least one node, the one at the top is the root node. And a tree can only
have one root node. A connection between two nodes can be called a link, or also an edge.
There are family tree names for different relationships. So to illustrate this, focus on the blue node there with the N in it.
A node that has children is called a parent, so N’s parent is P. And all of the parent node's children are called siblings. N has one
sibling, the S node. In some situations you also need to know the parent’s parent, cleverly called the Grandparent and that’s
node G at the top here. G also happens to be the tree root. A node’s parent’s siblings are called Uncles, drawn here with a U.
Nodes at the bottom, those with no children, are called leaves. If you follow the parent/child relationships up or down, you can
get a node's ancestors, and and node's decedents. A route from one node to another, either up or down, is called a path.
Any node is also the root of a sub-tree, even if the node doesn't have any children.
Unlike a human family tree, a child node can only have one parent.
The overall length of a path from root to a node is the node's depth, and the height of a tree is the longest path from root to any
leaf.

Uses for trees
OK, so what can we do with trees? One use is to maintain some sort of order to the data associated with each node. As long as
we can depend on that order being intact, we can find items in the tree faster.
Throughout this class we're going to see a few kinds of trees---binary search trees to start with, and then a special kind of
binary tree called a Huffman Code tree. And there are more. For example, in computer graphics, modeling tools and video
games we often use quad trees and oct trees to partition 2D and 3D space. All of those trees are designed to make it very fast
to store and fetch information.
Beyond sorting, trees can be used to model the sort of parent/child, or superset/subset relationships that we saw with the
organism example earlier. Trees can also model activities and the order that tasks can or must take place, which can be used to
determine a plan of action to complete the work more quickly.
Trees are often used for algorithms that rely on efficiently partitioning the available search space, typically relying on recursion.
This is because for most types of trees each node in a tree is also the root of a subtree that has the same properties of the
overall tree root.

### E03: Overview of Binary Search Trees

#### Preamble
A binary search tree is a special kind of tree that lets us quickly add and search for data.
Diagram
We've seen the general look and feel of binary trees in the last episode with this diagram. Now we're going to talk about what
makes binary search trees interesting.
Invariant: sorted data
A binary search tree can let us add, remove, and find data very quickly. And I'm probably going to leave the 'search' part out of
the name from here on. Like the linked list we built earlier, our binary tree will just hold integers.
We use the binary tree node's two child links to keep data sorted. We call them left and right. Let's say we have a tree with a
single node storing the number 50. An invariant of the binary tree is that values to the left are strictly less than a node's value,
and those to the right are greater than or equal to a node's value. So looking at our 50 node, we can safely say that if we're,
say, adding a node with 20, that it should be placed down the left path. If we're querying for a node with the value 70, we only
need to look to the right.
Don’t break the invariant!
It is critical to obey the ordering invariant because the operations all depend on it. The tree at left is OK, but the one on the right
has broken the invariant. The 40 should not be found down the right side of 50.
Why sorting matters
I should say something about why sorted data is useful. Say I have a billion data records, each of which is some awful twenty
digit number, but they're not in any particular order. What strategy would you use to determine if a particular number is there?
Next build
You'd have to look at everything! But if they're in order, then you can use clever techniques--algorithms--for sifting through
your data.

Next build
Now instead of an unordered list, what if the data was in a binary search tree? How many steps would it take to check for a
given value?
If our data was in a binary tree, we'd be able to trim out half the remaining data every time we followed a link. But anyway, we
go from a billion to 500 million, to 250 million, to 125 million, and so on.
Next build
On average you'd only have to look at 30 nodes to determine if your target number was there. 30 is a lot better than a billion!
We get this because every time we follow a link with a binary tree, we cut out half the search space.
Binary tree structure
We're working with a binary tree node structure, which has this definition.
```typescript
type BTNode = {
  data: number;
  left: BTNode | null;
  right: BTNode | null;
};
```
The name is BTNode. We could have called it just plain old `node`, or whatever. It has an integer data field, and two links, left
and right, both of which are references to other BTNode instances.
Binary search tree operations
Like most any other data structure, there's a set of operations that go along with it. They'll seem familiar to you.
The initNode function creates our new BTNode and gives a reference to it. insert and remove modify the tree, so we will
use a special BinarySearchTree container structure so we can modify the reference to the root of the tree. More on that soon.
And then we have four query functions, contains, getNode (which gives you a reference to a node with a specific value),
size, and toArray. That last one is sort of like the linked list report function, except instead of a string, it fills up an array.
Next Up
In the next episodes we'll cover tree traversal, which is vaguely equivalent to how we used a cursor to march through the linked
list structure. But tree traversal is way more interesting. Then we'll cover the specific operations that you'll implement in your
homework in the episodes after that.

### E04: Tree Traversal

#### Preamble
Now we’re going to dive in to how we examine trees. With linked lists we used a simple cursor to scroll through it. But with
trees, we have decisions to make about which direction to go from each node, and which order we do things in. Examining a
tree like this is formally called traversal, but usually we just say ‘walk’.
Three ways to walk

When walking any tree, you visit a node and its children. The three different ways of doing it depend on the order that you visit
the nodes. And by visit we mean 'do something with', which is a super technical term. Visiting means you're taking some action
on the node your cursor is on.
Pre-order: visit the parent first, then all the children from left to right.
In-order: visit some children (starting on the left), then visit the parent, then visit the remaining children (also left to right).
Post-order: visit the children left to right, then visit the parent.
Apologies for making the definition weird. For a general tree with an arbitrary number of nodes, there's not really a natural way
to define in-order. But for binary trees, it makes a lot of sense and you'll actually use it often.
For binary trees, in-order means you visit left child, parent, then right child. The examples I’m about to give are all about binary
trees.
Recursive traversal
In all of these cases, when you visit a child node, you also traverse the entire subtree it represents, using the same kind of
traversal. Let's run through this tree we've seen before, with a basic visit function that just prints out the strategy and a
node's value.
```typescript
const visit = (
  node: BTNode,
  how: string,
```
): void => {
console.log(
`Visit method: ${how}, data: ${node.data}`,
);
};
Pre-order traversal
So you'll likely have some function like preorder that does something like this, where you visit the node you’re on before its
children.
Next
Let's walk through that. So, first thing we do is call our visit function with the root. First line, check to see if it is null and it isn’t,
so continue.
Next
Using pre-order traversal we visit the node we’re on before processing the children. So we visit the node and it prints 50. Then
we visit the left tree with a recursive call to preorder, using the current node's left pointer.
Next
Then we're pointing to that 20 node. Just like last time, we’re using pre-order, so print its value. Then recursively call preorder
on its left tree. Inside that call, the node is null, so we just bail out. The right tree isn't null, so we recurse that way.
Next

So it prints out 40, recurses left and right, but they're both null so nothing is printed out. Now we’re done with the 40 node.
Next
And control gets back to the recursive preorder call on 20. But there’s nothing more to do here either.
Next
So we return to the 50-node, which has been waiting for the recursive call to the left subtree to return.
Well, we're back but still have the right child do do.
Next
So then we recurse down the right subtree. There we encounter the 70 node, print its value first, then recurse left (which is
null) and then right (also null).
Next
The recursive calls all wind back,
Next
and we finish the entire tree.
In-order traversal
Similarly, here is in-order traversal. Since we just went through pre-order in more detail than was probably necessary, I’ll just
talk this one out.
This prints out the order 20, 40, 50, 70.
Notice something interesting about that output? It is in ascending sort order! Neat. And that's not an accident, and I'm sure a
slightly modified version of this in-order walk will be super useful when you implement the toArray function for the homework.
Nudge nudge wink wink.
Post-order traversal
The last traversal method is post-order, and you can probably guess what it looks like already. It prints out 40, 20, 70, 50.
Traversal methods are similar
Let's look at all three functions right next to each other. Super similar. Really we're only adjusting the order that we visit nodes.
All three of these traversal methods have their uses, and we'll encounter all of them as the course progresses. I want to draw
attention to the null check again. That's the recursion release valve, where we determine if we can no longer continue. It is
really important that your recursive functions have something like that, otherwise they might recurse forever.
Next
So now that we’ve looked at how to get around in a binary tree, we can start looking at the specific binary search tree
operations for the homework.

### E05: BST Operations

#### Preamble
This episode is all about the functions you're going to implement for the homework.
Remember that we're working with binary trees, meaning nodes have up to two children, named left and right. And specifically
we're dealing with binary search trees, which adds the invariant about sort order--go to the left for smaller values, go to the
right for all others. I use a silly memnonic to remember this: left is less! Both words start with L and are four letters.
BST Operations
The operation list is like this. There are other operations you can have with binary search trees, obviously. And some of those
you'll likely need to implement as helper functions.
There's the one initialize function, which is super similar to the linked list one.
Then we have two functions that modify the tree: insert and remove. Those are tricky, especially remove, so I'll cover that in the
next episode all by itself.
Then there's the four query functions that should not modify the tree in any way.
Init node
The initialize function allocates a fresh BTNode, sets the data value to whatever number we're given, and sets the left and right
links to null. It then returns a reference to that new node.
Keep track of the ‘top’ node?
If you’ve done the Linked List assignment, you might recall that the mutation functions like append all returned a reference to
the start of the list, because it is possible for mutations to make it so the list has a new first node. So you would do something
like this to put 42 at the front of the list:
// linked lists - mutations return
// reference to start node
myList = insert(myList, 0, 42);
And I promised that there were other ways to do this as well. So in this assignment we’re going to use a different approach.
Here, we’ll have a different structure whose only job is to hold a reference to the topmost node of the tree, called the root. So
when we use a mutation operation that could change that topmost node, we’ll pass in that container structure, and our code
can just update that root value on the inside. So for a binary search tree when we insert data it will look like this:
// binary trees - mutations modify the
// object referred to by myTree
insert(myTree, 42);
The important difference here is that we don’t have to re-assign anything - there’s no equals sign here. The insert function
will take care of that accounting for us.
Init tree

So yeah, we’re going to have this other container structure, and it is super simple. I’m calling it BinarySearchTree because I’ve
very original, and it contains a single field, root, which is a reference to a BTNode.
When we initialize a new BinarySearchTree we set its root to null to indicate the tree has no data. Then we return that and
later on we can put whatever BTNode reference we want as its root value.
Insert
```typescript
const insert = (
  tree: BinarySearchTree,
  data: number,
```
): void => {
// TODO
};
Now when we want to put data into the tree, we’re only going to need an insert function. We get a reference to the
BinarySearchTree and the data value we want to put into the tree.
Insert 60
Inserting a node requires us to search through the tree for a spot to put it. Say we're asked to insert a node with value 60 into
this tree.
Next build
Start with the top of the tree, with node 50. Think about the binary search tree invariant. If we're inserting 60, where should it
go? Left or right? Well, 60 is larger than 50, so we search right by recursively calling insert with the right child.
Next build
Now we're looking at node 70. Since that's not null, we have to look at its children next. Where should node 60 go in relation
to node 70? To its left. Recurse that way. Now we're inserting at 70's left child, but it is null!
Next build
Since 70’s left child is null, that means we've found the spot to put our node 60. Just make a new BTNode for the 60, and set
70's left child pointer at our 60 node, and we're done.
Helper functions
For the insert function, most of the work is done by looking at BTNodes and their data, but the insert function receives a
BinarySearchTree reference. I recommend that you make a helper function to do most of the heavy lifting.
In this case, we have this pattern: look at a BTNode, and compare its value with the data we’re trying to insert. If it belongs to
the left, check to see if the left node is null or not. If it is, make a new node and hook it up to the left reference. But if the
left node isn’t null, recursively call our helper function with that node and the data to insert.
Inserting into an empty tree
The only hangup here is that in the insert function, we have to check to see if the BinarySearchTree we’re working with is
empty. If it is, we don’t need the helper function at all - we just make a new BTNode directly and set that as the root. Otherwise,

use the root field with your helper.
Since we’re working with references, our new root node will be accessible after this function returns.
Contains
```typescript
const contains = (
  root: BTNode,
  data: number,
```
): boolean => {
// TODO
};
The contains function simply seeks out a target value and returns true if it finds it, or false if it can't. This follows the same
logic, mostly, as insertion does for finding the insertion site.
The obvious difference is that contains gets a BTNode instead of a BinarySearchTree. So that means your contains
```typescript
function itself can and probably should be recursive. A sketch of the code might be like this:
```
Is the root node null? If so, return false. Or if the root node have the data value we’re after? If so, return true.
If we didn’t return yet, then the answer lies either on the left or right. Check if the target data is less than the node’s value, and
if it is, recurse left. Otherwise, recurse right.
Get node
```typescript
const getNode = (
  root: BTNode,
  data: number,
```
): BTNode => {
// TODO
};
The getNode function is similar to contains in how it seeks out the target node, but instead of returning a boolean, it returns
either a reference to the node, or null if it can't find it. You might consider implementing getNode first, and then letting the
contains function use this one to do the work.
Size
```typescript
const size = (root: BTNode): number => {
  // TODO
};
```
There are lots of ways you can compute the size of a tree. It is up to you to pick one.
One way is to make size recursive - the size of a tree is just the size of the left tree, plus the size of the right tree, plus one for
the node you’re looking at. The trick there is just to know when to stop the recursion — you just want to avoid recursing when a
child is null and return 0.

To array
```typescript
const toArray = (root: BTNode): number[] => {
  // TODO
};
```
Now for the toArray function. This just collects the data contained in a subtree with the given root, and returns it as a
Javascript array. The trick here is that the data has to be in order.
Since the tree’s data has all the lower values to the left, we can use that to our advantage and use in-order traversal.
Here’s how I think of it, using recursion: First I get the array for the subtree’s left side. Then I’ll add the subtree’s data value.
Then I’ll get the array for the subtree’s right side. I’ll glue them all together and return it.
Use MDN for Javascript
By the way, I recommend using the Mozilla Developer Network’s documentation. Like in this case I’d do a web search for “mdn
combine arrays”, and the first hit I get is what I want, the Array concat function. It gives examples. You could also use the array
“spread” operator. Give that a search as well. Lots of ways to do this.
Next
That was most of the binary search tree operations. Next I’ll cover the remove function, which is tricky enough it deserves its
own episode.

### E06: BST Remove Operation

#### Preamble
Removing a value from a tree is a tricky process, so it gets its own episode. There are a few edge cases to consider here, so I’ll
step through them and leave the trickiest bits to the end.
Remove signature
```typescript
const remove = (
  tree: BinarySearchTree,
  data: number,
```
): void => {
// TODO
};
Since the remove function is a mutation, it takes the container structure, BinarySearchTree, and ensures that if the root
reference changes, that is reflected inside the given tree structure.
Identify what (if anything) to remove
First you need to identify if the target value is even in the tree, and if it is, where is it?
Once you've found the node to remove, it isn't just a matter of deleting it, because it might have children. And remember the
binary search tree invariant: by the time you're done with your remove operation, the nodes must still be in sort order, left is

less and all that. And, we can't orphan anything. Only remove one node. So, careful!
Several cases for BST remove
So to recap, there are several cases to the remove operation and that’s what this whole episode is about.
We can remove a node with no children, or with one child, or with two children. In that last case, the node could be an internal
node somewhere below the root, or it could be the root node itself.
And of course, removing the root is a special case because we have to keep the BinarySearchTree root up to date.
So we’ll go over all of these cases now.
Remove node with no children
Say we're removing a node that doesn't have any children. In this case, we can just remove the reference by nulling out the
reference to it. In a managed language like Javascript, that is sufficient. In languages like C and C++, we would also need to
manually release that memory.
Remove node with one child
If the doomed node has one child, it is still pretty easy, we just need to update the reference from the doomed node's parent to
the one child of the doomed node.
Remove node with two children
Now things get complicated when we need to remove a node that has two children, because we have to shuffle things around
to maintain the invariant.
If we need to remove 10 from this tree, what should it look like afterwards? Stare at that for a second. What should 7's right
reference point to when we're done? How can we maintain sort order? Remember the invariant that “left is less”.
Predecessor and successor
One way to do it is to find a node that is adjacent from a sort-order perspective. The node that sorts just before our doomed
node is called the predecessor; the one after is called its successor. I'll explain how to find those in just a second.
In this case, the value that sorts just before our doomed ten is nine, the lower nine, and the value that sorts just after our
doomed ten is eleven.
Next
When finding a sort order buddy, you’ll also need to get a reference to its parent. We could pick either one of those two, we'll
just call it the buddy. In this example here, and also for the homework, we will use the predecessor.
Buddy value swap
Remember we’re removing the value 10, and the node that has 10 in it has two children. So to do this we need three nodes: the
node with the doomed value, its buddy node, and we also need the buddy’s parent.
First, take the buddy's value, which is nine.
Next

Then you’ll write that value into the node with doomed value. So we overwrite ten with nine.
Next
Last, remove the buddy by removing the reference from its parent.
So in this case the doomed value is the 10, its buddy is the lower 9, and its parent is the upper 9. And the node that actually got
removed from memory was the buddy, not the one that originally held the value to remove.
Before & after removing 10
... and it looks like this at the end, after removing the value 10 from the tree.
Finding buddies
Anyway, here's the trick to finding predecessor and successor. From any node, the predecessor will be a left turn followed by
as many right turns as you can make. And keep in mind that you might have to stop after that left turn.
Successor is the inverse: make a right turn then as many left turns as you can make. And, it is possible that the predecessor or
successor is not a leaf node, but it is guaranteed to not have two children.
And again, you’ll also need to keep track of the buddy’s parent node, because as we’ve seen the remove operation uses the
buddy’s parent. So, hint hint, if you make a helper function to find a buddy, consider returning the buddy and its parent.
Removing the root node
Special care has to be taken when you're removing the root node, just because you'll need to ensure that the
BinarySearchTree container is kept up to date.
Removing root with no children
Be sure to catch this situation too - you have to check ffor it, and once you’ve noticed it, just change the container’s root
reference to null.
Closing thoughts
So that’s it for the remove operation, and all the Binary Search Tree things generally.
For the homework, as always I recommend working incrementally. Take time to think about what you’re about to code. I love to
sit down and just hack, but this is not that kind of programming.
There are automated tests, and you should read them to understand what the tests expect. Run the unit tests frequently, and if
you’re working one particular operation, run that test in isolation.
I also recommend making sketches on paper or whiteboards or whatever is convenient for you. These slides are heavy on the
graphics for a reason: visualizing what is going on is suuuuuper important when you’re learning it, and for my money that’s just
as important for those of us who have been doing it for a long while as well.

## Exam 1 Study Guide

TODO

### S04: Abstract & Concrete Data Types

Sequence Preamble
This sequence is about abstract data types and concrete data types, and the differences between them. With abstract types,
you only care about the interface that describes how it is used. Like if you’re driving a car, the interface is steering wheel,
breaks, accelerator. With concrete types, you also care about the implementation details, like what mechanically happens when
you press the accelerator?

### E01: Combining tools for algorithms

Episode Preamble
We build algorithms to serve some purpose, maybe sorting data, responding to user input, playing media, whatever. In order to
carry out those algorithms, we might end up using several different kinds of data structures, and use other algorithms to do
some pieces of the work. It is up to us, the programmers of these things, to pick the right tools to work together to achieve the
overall goal. This is a lot of what programming is - piecing together building blocks that already exist, and sometimes building
new blocks of our own.
Interface vs Implementation
So earlier I gave this example with cars: the interface of a car involves the things the driver can use to make the car do things:
steering wheel, accelerator and brake pedals. The doodads you touch are abstractions, they’re “black boxes” - they have inputs
and outputs, but they don’t advertise how they work.
The how part is the implementation under the hood: you press the accelerator and depending on the particular vehicle, various
things can happen, maybe it is based on gasoline, or electricity, or magic. As a driver, I don’t really need to understand or even
be aware of the inner workings.
As a programmer, in theory I also don’t really need to understand the inner workings of an abstraction. I just need to understand
what inputs and outputs it has, and I can use it accordingly. The implementation–what happens between input and output–is
abstracted away.
List: Abstract vs Concrete
Maybe to pick a specific example, let’s take Lists. What can you do with a list? Maybe you can index into it with a number—like,
give me element 4, or let me change element 4 to be some value—or we can query the list to see if it contains a certain value. If
we’re asking about what can you do with a data type, you’re really asking about its interface, it’s abstraction.
But the abstraction isn’t enough to actually get the results you want. You need a concrete implementation of a list. And you
could implement a list in lots of ways, some of which we talk about in this class. You could use an array, or a vector, or a linked
list, or a skip list, or invent your own thing entirely. As long as you pick a concrete implementation does the things the
abstraction says it can do, you don’t need to understand the implementation details.
ADTs in programming languages
This idea of abstractions versus implementations is quite common in programming languages. You’ll often see the term “ADT”,
which stands for “Abstract Data Type” as a shorthand because programmers use the idea so often.
Here are some common abstract data types.
- Collection: Generic word for any grouping of data

- List: Sequence supporting random access
- Map: Associates keys with values, access via key
- Set: Unordered group of unique objects
- Bag, Multiset: Like Set but duplicates allowed
- Queue: Collection w/ First In, First Out (FIFO) semantics
- Priority Queue: Queue ordered by priority
- Stack: Collection w/ Last In, First Out (LIFO) semantics
- Graph: Models relationships among data
You can work with really any programming language and talk about these things, and other programmers will know what you
mean. Since they’re abstract, they talk about what they can do and not how they do it.
And once you understand the abstractions here, you can think in terms of those, and they make it a lot easier to invent creative
solutions to new problems.
Next
So in this episode I dwelled on the idea of abstract interfaces—the behaviors that something can have—and compared that
with the idea of concrete implementations—the specific machinery or code that carries out those behaviors. Often you only
need to think in terms of abstractions, but other times you need to get your hands dirty and implement those abstractions with
a concrete data structure.
In the next episode I’ll go into detail on a few ADTs so we can understand how me might implement them.

### E02: Stacks, queues, priority queues

#### Preamble
This episode is all about three related abstract data types. Stacks, queues, and priority queues. Since they’re abstract, you can
implement them in various ways. In the episode after this one, we’ll talk about how you could implement a priority queue with a
data structure called a heap.
Stacks and queues
Along with arrays, I’d say stacks and queues are the foundations for everything else. Stacks and queues are very similar, in that
they both let you add data to them, and they let you get data back out of them in a prescribed order.
Stacks
The canonical example is a stack of plates. You push a new plate onto the stack. When you need a plate you pop it off the
stack.
This means that a Stack has Last In, First Out semantics, often abbreviated LIFO. I don’t know why it isn’t First In, Last Out
(FILO). That would be more fun.
The point here is that the most recent thing that was added to the stack will be the thing that you get back, if you ask for data.
The data that was pushed onto the stack first is at the bottom of the stack, so it will be the last thing you get back. Really, just
visualize a stack of plates, and you can remember how this works.
Stacks are super useful
Stacks have many, many applications. A programming language compiler or interpreter uses stacks to parse your source files.

If you’ve done any graphics programming, you might have used stacks without even realizing it. You can push state onto a
stack, modify some settings and use them, and then pop the stack to restore the state from earlier.
Stack terms: push, pop, peek
Stacks have special words for using them. When you add data to a stack, you push onto the stack. When you remove data, you
pop the stack. And if you want to read but not remove data from the stack, you peek the stack.
Queues
Queues are in some sense the opposite of a Stack. Queues are First In, First Out. Imagine we’re all English, and we form queues
when waiting for something. The first person in line is the first person to leave the line, that’s fair, right? Remember this phrase:
FIFO = First In First Out. You’ll see it everywhere.
Queue Quirks
A bare-bones queue doesn’t need to give operations like random access by key or index. It doesn’t even need to give the size.
All a Queue is required to do is remember which order things were put in so you can remove them in that order.
Queue terms: enqueue, dequeue
There are special words for adding and removing from queues. I don’t know why. Enqueue is the fancy word for adding to a
queue. Dequeue is the fancy word for removing from a queue. I’ve also heard people use push and pop to mean enqueue and
dequeue, though usually those are stack words.
What stacks and queues are good for
Stacks and queues are linear, meaning they record an ordering based on when items showed up. Despite that linear-ness they
are very useful in traversing nonlinear structures like graphs or trees. Stacks and queues give us a way to record a path
through some complex structure. For example, when you walk a binary tree, there’s a record of the order you encountered
nodes, which has stack semantics. Graph algorithms use queues and stacks all the time to keep track of which order to
process data.
Priority queues
So now we get to priority queues. Which are like normal queues, but you can prioritize the data that they contain in some way.
In this drawing, the queue prioritizes people by height, shortest first. This is obviously a ridiculous example.
A more realistic example might be when people wait their turn at the Emergency Room, people with some traumatic situation
will be prioritized ahead of people with, I dunno, paper cuts.
Emergency room priority queue
A priority queue is often used to arrange activities so that we always handle the most important one next. So at the emergency
room at the hospital, we rightly want to prioritize serving people with life threatening medical situations over those who are
merely in agony, and again prioritize those in agony over those who can wait a few hours.
When you add something to the priority queue, use its priority to put it in the right place. In this situation, people’s situations
have a priority number. So if somebody comes in with priority seven...
Next build

They will be placed between the people with priority 5 and 8. I need to talk with my production staff about these pictures.
Sorry.
Next build
If you add a low priority thing to a priority queue, it will end up at the back or near the back of the line. But adding a high priority
thing will place it towards the front. The highest priority thing will always be first in line. Second highest is next, and so on.
Priority queue is an abstract data type
A Priority queue is an abstract data type! You could implement it in any way - you could keep a list, or a sorted array, or use
magical elves. As long as you can enqueue things with priorities, and dequeue those things and get them back in priority order,
you have a priority queue.
Build a priority queue without magic
So what are some ways of implementing the priority queue ADT? There are loads of ways to do this, and remember you have to
obey the abstraction:
- Enqueue to add an item with a given priority
- Dequeue to remove and return the item with the highest priority
- Peek to see what the highest priority item is, without removing it
- ... that’s it!
An obvious but inefficient way
One way, which is not efficient but it easy to understand, is to just hold all the items along with their priority in an unsorted list.
When we enqueue something, just put it in the list wherever. And that’s constant time complexity.
When we peek or dequeue, we scan the entire list to find the one that has the highest priority. In that case, we’re talking O(n)
complexity because we have to look at every item in the queue.
Next Episode
We can do better than that! In the next episode, we’ll talk about the binary heap, which is a concrete data structure that is often
used to implement the priority queue abstract type.

### E03: Binary Heap

#### Preamble
A binary heap is a data structure that can be used by a sorting algorithm called a heap sort, and for implementing priority
queues. There are other uses as well, but we’re going to focus on the priority queue. Binary heaps are fun, because they can be
drawn as a binary tree to help us easily see what’s going on, but in actuality you really only need to use a sequential list to
model it. I’ll show both forms in this episode.
Drawn as a binary tree
[picture: binary heap without values]

So here is a binary heap, drawn as a binary tree. An invariant of the binary heap is that we always fill the data structure up from
top to bottom, left to right. So this tree has the right shape.
(Next)
[add picture: binary tree that has gaps in it]
This tree doesn’t have the right shape because there are gaps to the left of some of the nodes. The last layer has to fill from the
left.
Drawn as a sequential list
Now we can also represent a binary heap as a list.
The root node is at offset zero, its children are at offsets one and two, and their children are at offsets three through six, and so
on. Every layer from the tree view has twice the number of possible spots as the one above it.
And when you look at it as a list, you lose the obvious visual of all of that. It is easy to do some simple math to figure out where
an item’s parent is, and where its children are. And I’ll show you that in a sec. And it is really obvious where the end of the list is,
which will be important soon as well.
So we have these two equivalent ways to draw it, but since it is easier to reason with when drawn as a tree, that’s how I’ll
usually draw it. Even if it is actually modeled with a sequential list.
Heap property
[picture of max binary heap with values in it]
There’s one more critical ingredient to making a binary heap work. That’s the heap property.
With a max heap, this means that the values on higher levels are towards the top, the root having the largest value in the tree.
With a min heap, it is the reverse, where lower values are closer to the root.
So this tree is a a max heap, because for any node, its parent is greater than or equal to its value, and its children are less than
or equal to its value.
(next build)
[picture of busted max heap with the root breaking the invariant]
This is trying to be a max heap, but it is broken because the root value is breaking the max heap invariant.
Fix a broken heap: bubble down
As long as there is only one spot where the invariant is broken, we can use an algorithm to fix it. In this case here, the root is
smaller than its children. We’ll fix this by working downwards, swapping parent and child until it is fixed.
In this case, the 100 at the top breaks the invariant because one of its children is larger.
(next build)
So get a reference to that child, and swap it with the parent. So we’re exchanging the 100 at the top with the 110.
(next build)

After that, we fixed the problem at the root, but now our 100 node is still parent to the 105 node, which still breaks the max
heap rule. So, we’ll do it again.
(next build)
Now the heap is in good shape again. There are no children for the 100 node now. If there were, we’d have to compare the 100
with their values as well, and maybe keep the process going. But not in this particular case.
This is called a ‘heap down’, or ‘bubble down’, or any number of other names.
Fix a broken heap: bubble up
[add a picture of busted heap where the problem is at the bottom]
If instead the problem is at the bottom, we’ll fix the heap by working upwards instead, so this is called ‘heap up’, ‘bubble up’, or
whatever else you want to call it, as long as it is clear that you’re repairing upwards.
In this case, we have a min heap, so smaller values should be towards the top.
The 30 is in the wrong place, because its parent is larger than it is.
(next build)
So we will take the 30 and its parent, the 50, and exchange them.
(next build)
Now the 30 is below a 20, and the invariant is met. So we can actually stop at this point.
If the 30’s parent had been larger than 30, then we would have needed to exchange those as well.
Regardless, you always have to stop when the node you’re repairing, the 30 in our case here, becomes the root node of the
heap.
Priority queue operations with binary heap
So recall that we can use a binary heap to implement the priority queue abstraction, which includes:
- Enqueue - adding to the queue with a given priority
- Dequeue - removing and returning the highest priority item
- Peek - reading but not removing the highest priority item
Now I’m going to cover how to do these things specifically with a binary heaps, and we’ll use the bubble down and bubble up
repair functions along the way.
Enqueue
To add to a priority queue, we’re just inserting data into the binary heap and making sure we obey all the invariants. Say we
want to add something with priority 4 to this max heap.
So here’s the score: find the next available spot, and put a new node there. Remember that binary heaps fill top to bottom, left
to right.
(next build - Enqueue)

So this is the next spot, and we put our new thing there. But it breaks the law! Max heaps have higher priority towards the top,
but this new thing with priority 4 is below a 2. So we have to fix that, by bubbling up. We need to swap the 4 with its parent.
(next build - Enqueue)
And then we check again, and find we’re still breaking the rules, because its parent is a 3. So we swap again.
(next build - Enqueue)
Now we’re not breaking any rules, so we can stop. We’ve inserted the new thing, yay.
Dequeue
The highest priority thing from a binary heap is always going to be the root node. So to dequeue from a priority queue built
from a heap, we have to remove the root node.
Here’s the approach: copy the data at the root, because that’s what we’re going to return. But then we need a new highest
priority item. So to do this, we’re going to remove the last item from the heap, the one at the bottom right which in this case is a
two, and
(next build - Dequeue)
make that the new root. But in doing this we’re breaking the invariants again. This time the problem is at the top, so we have to
fix downward.
When we’re fixing downwards, we have two children to look at. When we’re fixing downwards in a max heap, always choose the
larger of the two children. In a min heap, always choose the smaller of the two children.
(next build - Dequeue)
Since this is a max heap, we’ll swap with the larger child. And now the max heap invariant is happy again - the highest value is
on top. So we just return the four that was the original high value. And we’re done.
Peek
I left the easy one for the end. Peeking is just reading the value of the highest priority thing - and you always have a direct
reference to that because it is at the root. And since we’re not modifying the structure, we don’t need to repair anything.
How to follow pseudocode

As an aside... If you read a book or hit up Wikipedia to look at data structures there will often be passages that look like this.
Here’s a screenshot from the Wikipedia page on binary heaps, showing how to repair the tree in a downwards direction.
The syntax is meant to be clear to a human reader. This isn’t a programming language in the sense that a compiler can do
something with it, but it really does look close, right?
To translate this into Javascript, you’ll just have to figure out what each line is doing, and just re-write it. Sometimes what I’ll do
is literally copy/paste the pseudocode into my actual code, comment it out, and now I can just translate each line of
pseudocode into actual code. This can be good practice if you’re struggling with syntax.
For example, the first line there, we have “left, left arrow, two x i”, which I take to mean something like
(next build - pseudocode)
```typescript
const left = 2 * i;
```
... all we’re doing is calculating 2 times i and assigning it into a variable called left. So left and right are numbers, they’re
the indices of the left and right children of the node at index i.
Closing thoughts
This whole sequence was about abstractions - what you can do with a thing - and implementations - how the thing actually
works. I mentioned a few data structures like stacks and queues, and went into more detail with the Priority Queue abstract
data type. And since abstract data types are just abstract ideas, you need an implementation to do something with it. And so
we went through binary heaps, which is a way to implement a priority queue.
I have a whole sequence on Huffman Encoding, so if you watch that, you’ll see priority queues all over the place. Ok, bye for
now.

### S05: Huffman Encoding

Sequence Preamble
This next sequence introduces data encoding and decoding, which is sometimes called codec. That's how we take data from
one format like a high quality audio format, and encode it into another format like MP3. Then once you have the encoded
version, you'll probably need to decode it to do something useful, like play the song encoded in the MP3.
We’re specifically going to build our own implementation of a well known codec called Huffman Coding.

### E01: Data coding

#### Preamble
I’m going to start by talking about data encoding and decoding, why we care, forms it can take, and various use cases.
Why encode and decode?
All the data you use in a computer is encoded in some way. It could be a standard encoding, like the standard that says
#ff0000 is red, or that the letter e will be stored by the seven bits 1100101. After all, digital computers can only store numbers
--- how we interpret those numbers is up to us. We need to devise an encoding scheme.
Next build - why we do this
So, for starters, encoding is a basic requirement to do anything useful with a digital computer.
Some encoding is meant to squash data down into a smaller size. This is called compression, and it is one manifestation of
encoding. We do this to make better use of disk space and transmit information faster.
Some encoding is meant to hide information, even in plain sight. You can encode some text using encryption to get cyphertext,
which can (or should) only be decoded using some decryption method.
Lossless vs Lossy compression
An encoding can either be lossless or lossy, and which you choose depends on the situation.
A lossless codec will let you take your data (like the works of Shakespeare), encode it into some other format (shakes.zip), and
then later decode that version into a copy that is identical to the original.
If you need bit-for-bit replication, you'll need a lossless format.
Lossy compression
[high res vs low res photo]
A lossy codec sacrifices some information during the encoding process, so that when it is decoded we have an approximation
of the original, but not a bit-for-bit replica. Now, exactly which information gets left out depends on the application. A lossy
image format might reduce the number of colors. Or a lossy audio format might sacrifice frequencies that humans can't hear
anyway.
Data compression
The general idea with compression is to take any data, and do some math on it to get a version that requires less information,
while retaining the ability to uncompress it into something that matches the first version to some degree. This might be entirely

a function of the input, or you might have some external information, like statistics about how common certain words appear.
The strategy you take might depend on the nature of the input. So you'd use one method for compressing sound files (mp3),
another for compressing images (jpg), and another for compressing text.
And within a category, like compressing text, you can tweak the strategy based on the specific information. For example,
compressing English text vs. German vs. Chinese all use different symbol alphabets.
If you go full circuit with your data, and in the end you decoded version is not identical to the input, you’re using a lossy
compression scheme. MP3 is like that.
Example: sensor data
Let's go through an example of lossless data compression. We have a remote, solar-powered temperature sensor that is going
to transmit data every once in a while in a batch in order to save power.
Let's say the sensor has recorded these values over the course of the morning: <40, 40, 40, 40, 40, 41, 41, 41, 41, 42, 42, 42,
42, 42>
Next build - sensor data
There are 14 total samples, and each one is stored as a 32-bit integer in the sensor's memory. If we were to transmit this
information without compressing it at all, it would require 448 bits of data.
But let's look at the data. There's only three numbers!
So we could compress this by coming up with an encoding strategy based on the data we have. Let's encode the samples like
this:
Next build - sensor data
40 == bit string 1
41 == bit string 01
42 == bit string 00
In that case the data encoding would be 11111010101010000000000. That’s 23 bits of information.
Sensor data transmission
So in addition to those 23 bits to encode the data, we also have to send up information about how it was encoded so that the
other side knows how to deal with it. I’m just making up a scheme here.
Let's say in this made up scheme, there's one byte (8 bits) to communicate how many mappings there are. One byte lets us
send up to 256 mappings. Then each mapping gets 16 bits, to say for example the original number 41 maps to the bitstring 01.
Last but not least, we also transmit the 23 bits of encoded data.
Next build - transmission
This adds up to 79 bits for encoded data set. That's about an 80% reduction. And that reduction would be much much better if
we had more than 14 samples!
Compression runs the internet
Data compression is one of the things that lets us have the Internet. Without it we'd not be able to have streaming video or
audio. Even plain old boring text transfer is improved by compressing data when transmitting, because web pages themselves

are just marked up text.
Any time you have statistical redundancy in the information, it can be compressed.
Reasons to NOT Compress
But there are reasons to not compress your data. Compressing and decompressing takes computational overhead. And that
might be an annoying step to decompress the data every time you need it. If memory or storage is cheap but CPU time is not, it
might make sense to leave the data uncompressed.
For example, CD audio is not compressed, so it takes little processing power to play the music. But MP3 audio is compressed
and takes computation to decompress it. We now have hardware-based mp3 decoders that makes this practical, and have for
years.
You might also want the data to be human readable, and compressing it will take that away.
Next
So this episode was just an introduction to what a codec is, how we encode and decode it, and a simple worked example of
compressing some sensor data. Next up I have a short episode that is about compressing text that covers the same idea, but
maybe in a more intuitive form.

### E02: Lossless text compression

#### Preamble
Text is everywhere, in every written language. And if you can twist your perspective a bit, even other media like images and
genetics can have text-like properties. So people have found ways to encode large blocks of text into smaller blocks of data, so
they can be stored on disks or transmitted over the internet more efficiently.
Frequency of letters in collected works of Shakespeare
Here's a fun chart that shows the frequency of letters in the collected works of Shakespeare. I got the source text off of Project
Gutenberg, and years ago I wrote a little Go program to do the analysis.
You probably already had an intuitive awareness that some letters like E appear way more often than letters like Q or Z. But just
looking at this chart you can see that the first six or so letters comprise like half of the overall text. Statistically speaking, if you
were to open this book and close your eyes and pick a letter at random, there's like a 12% chance it would be an E.
Parts of words
Fancier approaches look at common sequences of letters, like suffixes '-ing' or '-ered', and prefixes like 'super-' and 'pre-'. The
idea here is to find some common sequence of letters or words and be able to substitute them with some shorter symbol. Once
we agree on a substitution, and by that I mean an encoding, we can write the shorter symbols instead, and anyone who knows
the encoding scheme will be able to decode it.
Phrases
And you don't have to stop at word boundaries. Some words just appear in the same sequence, like "The United States of
America", or "The University of". So in this encoding scheme, the sawblade followed by diamond star means The University of
The United States of America.
At any rate, you can chop up your input however you'd like; some approaches can work better than others. It depends on the
length of the input, what language it is written in, and so forth. Once you've chopped up the language into chunks, then you

can assign symbols to each chunk, and put those symbols in the right order to encode the original text but in a much compact
format.
Fixed vs variable length
A common way to store characters in a computer is with an encoding scheme where each character has the same fixed length.
ASCII is a common one, and it uses seven bits to represent each character.
This is useful because it is very easy to write and read. But it is not very informationally efficient. E takes just as many bits to
encode as Z, even though E is way way way more common than Z.
Some encoding methods don't have a fixed size for each chunk to convey. Morse code is like that. E is super common, so it is
short (single dot!), and Z is not common so it is pretty long (dash dash dot dot).
Using a fixed length code makes decoding it easier, since the reader can grab chunks at a predictable rate, like a byte at a time.
But it means the encoded message is likely longer than it would be using a variable length code.
Using a variable length code means the reader has to study the message carefully as it is parsed, sometimes using external
information. For example, both the ASCII and Morse Code strategies have established mappings between characters and
encoding. But some other methods might include that mapping in the message itself, or the mapping has to be transmitted
separately.
Next
So where is all of this going? In the next couple episodes we’ll work up a full encoding scheme called Huffman Coding to build
on all of these ideas.

### E03: Huffman: Intro & Build Tree

#### Preamble
In this episode we’re going to look at an encoding scheme called Huffman Coding, and learn how to build the data structure
used to encode and decode data. If you’ve seen my sequence on abstract and concrete data types, you’ll remember the
priority queue and binary heap data structure. Both of those will be used heavily here.
An encoding scheme
Say we want to devise a system for representing symbolic data using numbers. Maybe A is 1, B is 2, and so on. If we want to
represent the 52 upper and lower case letters used in English, plus some other symbols like spaces, commas and periods, plus
ten digits, we might have 60 symbols to encode.
Using this scheme, we can encode the entire paragraph above using
Next build - encoding scheme
2368 bits (296 bytes), with eight bits per symbol. But we could compress this data so it it uses much less memory. Huffman
Coding is one way to do this. It is also a really fun algorithm.
Shakespeare frequency graph, again
This is the distribution of letters from the collected works of Shakespeare, sorted from most to least frequent. It only includes
letters, so no punctuation or spaces. The letter E is almost 300 times more common than Z.

Naive graph
A naïve way of encoding the letters of the alphabet is to put all the data down on the leaf layer. Five bits gives you 32 possible
leaf nodes; some of which are not used. This means each symbol requires the same number of bits to identify it.
Next build - naive encoding for E and Z
Using this tree, following the path from the root down to E, we go left, left, right, left, and then left. If you substitute 0 for left,
and 1 for right, that gives us a bit string 0 0 1 0 0. So that's five bits to encode an E in this scheme.
Similarly, you can follow the path for the letter Z, or Zed for you Canadians, and that also gives you a five-bit encoding. Even in
Canada.
Next build - E is common, Z is not
But remember that E is 300 times more common than Z. It is a shame that it takes the same number of bits.
What if we could use a variable number of bits to represent different symbols? E.g. 3 bits for 'e' since it is so common, but 7 bits
for 'z' which is rare? This would mean the entire collection of data requires less space. This is the goal with data compression.
Lossless compression
The goal with lossless data compression is to find an alternate encoding so we can compress and reconstruct the data without
losing any information.
Huffman 3-step
There are three main steps to take for the Huffman encoding strategy.
First, you’ll use some corpus of information to create a frequency table and a codec lookup tree. You only need to do this one
time, and the results here will be re-used for the next two steps.
Second, use the frequency table to encode whatever data you have. This gives you a compressed version of the data.
Third, use the same frequency table to decode the compressed version, which should give you a replica of the original data.
We'll spend the rest of this episode going over the frequency tree / codec lookup tree step, and the following two episodes
going over the encoding and decoding steps.
Make frequency table
To make a frequency map, scan a corpus of text (or other symbolic data) and create a table of characters with how often they
appear. Here I’m using Beowulf, for some reason.
You can do this as a frequency (like 10%) or a count. I’ve done it using a symbol count. Either way works, you just want the
numbers to be larger for more common symbols.
Priority Queue from symbol frequencies
The frequency table gives a mapping of symbols to their relative frequencies. Use this data to create a priority queue where
smaller frequencies have higher priority. In all of these examples the front of the queue is on the left.

Next (priority queue)
We’re going to use the priority queue to create a binary tree called an encoding tree.
Each node’s priority is how rare each item is. So the smaller the frequency, the higher the priority.
The tree's leaves will hold symbol data (e.g. 'z' or 'e' or punctuation characters). Internal nodes don’t contain symbol data, but
they do hold references to children, as well as the sum of the child node frequencies.
Next (algo overview)
The algorithm works like this. We'll pop two items from the priority queue, combine them to form an internal node whose
priority is the sum of the child nodes, and put that node back in the priority queue. And we’ll continue that until the priority
queue has only a single node left.
Next (pop two items)
OK, so let’s run through this. We first pop the two highest priority items. These happen to be for z and q, as they are the least
common items. We make a new combined node that includes the sum of the popped node frequencies, 2+2 = 4 in this case.
Also the combined node has left and right child references, and we’ll use the popped nodes as the left/right children. The
combined node doesn’t contain any character information.
Next (popped nodes not in queue)
Note that the two nodes we popped are no longer in the priority queue.
Next (insert combined node)
Instead, we enqueue the combined node we just made, using its frequency, in our case it is four.
Next (pop two more)
Pop two more nodes, combine them, and
Next (enqueue again)
Enqueue that new combined node.
Next (pop two. interesting)
Now something interesting happens. The next move is to pop two nodes, and one of those is a combined node! We don’t
actually have to treat this any differently, I just thought I’d point it out. Make a new combined node out of these two nodes,
Next (insert the interesting node)
and re-insert it. It ends up here between the 9/v and the 14/b nodes. Notice that the node we’re inserting also has priority nine.
Your implementation has to be consistent about how it handles ties.
Next (greedy)
You can see now that we're starting to build one big tree by combining the two nodes with the lowest frequency on each step
and reinserting the combined node back into the priority queue.

As an important aside: This is a 'greedy' algorithm because it chooses a locally optimal path--combining the two least frequent
nodes at every step. There are bazillions of algorithms that we call 'greedy'. Greedy algorithms only look one step into the
future using local information, rather than looking for a global optimum using all (non-local) information. Just wanted to point it
out.
Next (final tree)
The resulting tree has this general appearance. This is actually a bigger, different tree from what we were building. You’ll see
this tree a lot in the next episode. The important thing to note here is that common characters end up close to the top, and rare
characters like X are more hops away from the top.
Now & then
So in this episode we covered how to build an encoding tree. First we scanned through an input corpus and determined the
relative frequency of all the symbols we saw in there. Then we used that information with an algorithm to build the encoding
tree.
Next up, we’re going to use that encoding tree to encode and decode messages.

### E04: Huffman: Encode

Now we’re going to use our Huffman tree to encode messages, and in the next one we’ll decode. We’ll take a little detour first,
to set things up, and to talk about the properties that a Huffman tree has.
Pick your alphabet
When you want to encode or decode messages using Huffman codes, it is critically important that you use an encoding
scheme that actually contains all the symbols you want to encode and decode. So in this example we're going to build a
Huffman tree using this sentence as the corpus:
"This is an example of a huffman tree"
This is somewhat shorter than the collected works of Shakespeare, and as you can see, many letters are left out of the
encoding entirely. So if we are going to use this corpus, we can only encode and decode message that use the letters you see
here.
We can encode the sentence
Next - health of an ox
"the health of an ox”
but not
Next - healthy as an ox
"healthy as an ox"
because there is not a Y in the original corpus.
Huffman tree properties
Huffman trees have some interesting properties that we'll make use of. First, all Leaf nodes are where all the symbol data is
kept.

Next build - internal nodes sum of frequencies
Second, all internal nodes store the sum of their child node frequencies. This means we don’t have to compute anything to
know how frequent the symbols in a node’s subtrees are. Also, internal nodes will never contain symbol data.
Next build - frequent near top
The most frequent symbols have the shortest path to the root. This is the main property that lets us compress data effectively.
Next build - rare towards bottom
And the converse of that is that the least frequent symbols have the longest path to the root. If we encoded sentences that
involved lots of O’s and X’s and R’s, this particular Huffman tree would not be super efficient.
Let’s encode!
Say we want to encode the string
"the health of an ox"
using our Huffman tree. For each symbol we will output a bit string representing the path from root to that symbol's leaf node.
Without compression, each symbol requires the same number of bits. Say we need 8 bits per symbol.
With our Huffman encoding (using this particular tree) a symbol requires anywhere between three and five bits. This is because
the leaf nodes appear at levels three, four, and five.
Encode - t
When encoding, we proceed through our input text one symbol at a time. The first symbol is T. So we identify the path from the
root to our T node. Every time we go left, we emit a zero. Every time we go right we emit a one. So for T, we emit 0 1 0 1, since
we go left, right, left, right.
Encode - h
Then we do it again. H is next, and we go right, left, right left, so we output 1 0 1 0.
Encode - e
Now we encode the E. Notice that the E is higher than the other symbols we’ve encoded. So it takes fewer bits to encode - 0 0
1.
Encode - space
Then we encode the space character, which is actually the most frequent character, and it also only takes three bits, 1 1 1.
Encode - h
Another H, which we’ve seen before, so you can check that it is the same. 1 0 1 0.
Encode - e

And an E, 0 0 1. Also we’ve seen this before. It keeps on going until we’ve encoded the whole input sentence.
Full bit string
By the end, we have this bit string. To encode this sentence using 8-bit characters, it takes 152 bits. Our encoding takes 69
bits. This is about a 55% compression rate. Not too bad!
Build an encoding lookup table
You might have noticed that when we encode a letter, we’re traversing this tree to find out what bit string we should use.
H for example is always 1010, and E is always 001.
So one thing you should do before you encode is to use your tree to build a lookup table so we don’t have to mess around with
the tree any more.
To do that, all you need to do is walk the tree. When you find a leaf node, add an entry to a table that tells you what the
encoding is.
And I said you should do this, because when all you have is an encoding tree, how do you find the symbol you’re looking for?
We don’t have the path to walk! And that’s actually the information we’re trying to get at.
So, when you encode text, you will first need to make a lookup table and use that, rather than using the encoding tree directly.
Next
This episode was all about encoding text into bit strings, and in the next we’ll see how to decode those bit strings to get the
original text back.

### E05: Huffman Decode

#### Preamble
This episode is about Huffman decoding. If you didn’t catch the one on encoding, you should probably check that out first
because this follows directly from that one.
Let’s Decode!
Ok so now we have this bit string, without the visual benefit of spaces to separate the symbols. How's this work? We break out
our Huffman Tree (the same one that was used to encode the data) and use it.
Start by placing a cursor at the root, and then reading each bit one at a time. When we see a zero we update the cursor to point
to its left child; one means point it right.
When the cursor ends up on a leaf node, stop. We've reached the encoded character. Output that symbol, reset the cursor to
the root and continue until we've run out of bits.
Decode - 0
Starting from the root, we first see a zero, so we follow the left child. It isn’t a leaf node, so we just read the next bit.
Decode - 01

Next we get a one, so go right. Also not a leaf.
Decode - 010
Read a zero, go left. Still an internal node, not a leaf.
Decode - 0101
Read one, so go right. Now we encounter a leaf node, so we emit the symbol at that node, a T. Reset the pointer to the root
node and keep going.
Decode - 1
One, go right.
Decode - 10
Zero, go left.
Decode - 101
One, go right.
Decode - 1010
Zero, go left. Found a leaf node for H, so we emit that.
Eventually
This process continues for a while, and eventually we decode the message, which was
Next build - Decode - done
‘the health of an ox’. Honestly I don’t know why I picked that string, it was the first thing that came to mind that could be
encoded with the corpus string that we started with.
Closing thoughts
So now you know how to make your own Huffman codec.
This coding scheme is a way to losslessly encode and compress information. Along the way you make heavy use of a priority
queue, a binary tree, and a lookup table. The priority queue itself is probably best built using a min binary heap.
There are loads of compression schemes, but if you implement one like this you’ll better be able to appreciate the others.

## Exam 2 Study Guide

### S06: Graphs

#### Preamble
We’re going to add to our repertoire now with a really versatile data structure called a graph. In this sequence I’ll start with an
overview of graphs and their relationship to other things that we’ve seen.
Pun totally intended, because graphs are all about relationships.

### E01: Overview of Graphs

#### Preamble
So I’ll start with just an overview in this episode, and use the bulk of this sequence to animate the main kinds of search
algorithms we use with graphs.
Our old friends
We’ve seen graphs before, though we didn’t call them that.
Linked lists and binary trees are both specific types of graphs, where the particular rules give us these shapes.
A linked list is made up of boxes and arrows, where each box can reference at most one other box with an arrow. And a binary
tree is also made up of boxes and arrows, where each box can reference at most two other boxes using arrows.
(next build)
A graph is also made up of boxes and arrows, and in the most generic case, there are no rules about how many connections
each box can have, or even if the connectors have arrow heads on them.
What is a graph good for?
Graphs model the relationship between things: maybe they’re computers on a network, or data centers in North America.
Maybe a graph models people, and their social network, or criminals and their organization. Or maybe you’ve brainstormed
ideas and created a mind map of ideas, and drawn lines that connect some of them. The food web is another example you’ve
probably heard of.
Take this social network example. Who are my friends in Colorado? You can run a search algorithm starting with the node
representing you. Who are all my friends-of-friends? That’s another search where you only go two layers deep starting from
the “me” node. Who are all my friends-of-friends who live in Colorado? This is a combination of the first two. We’ll cover these
graph algorithms in the next couple of episodes.
Graph jargon
Graphs are central to lots of disciplines: from mathematics to marketing, and all over the place in software. And given that it
isn’t surprising that the different disciplines have their own jargon for it. I’ve sort of blithely used the terms “box and arrow”,
which is not exactly formal but it does communicate the idea. You have items and relationships between those items.
A node is an item in a graph, drawn as a box or a circle, or any other way that says “this is a thing!”. They are often called
vertices and a single one is a vertex. And if you’re modeling something where those things have a better name, like if you’re
modeling a social network, then you can also use that name, like “Person”.
An edge connects nodes together. They can be called links, connections, and anything else that connotes a relationship

between the things in the graph. So in a social network, an edge might be called a “friend relationship”.
Fun facts about graphs
There are lots of kinds of graphs, because there are lots of domains to model, and different ways to model them. So this
includes things like where the ‘first node’ is, what the nature of the edges are, what rules there are around how nodes can be
connected, and what kinds of paths you might form by navigating a graph.
Lots of nodes
Graphs nodes can have any number of related nodes - so while lists and binary trees were limited to one or two children, graph
nodes could potentially be related to thousands of other nodes. Though the term ‘child node’ probably isn’t apt, since graphs
often model relationships that aren’t about hierarchy.
No ‘first node’ in general
With linked lists and binary trees, there was an obvious “first node” - like the start of a list or root of a tree. But with graphs,
unless there’s some domain-specific reason to believe otherwise, there isn’t a clear “first node”. For example, a social network
might not have a single primary node, unless you’re talking about your own personal network, with you at the center.
Edges can be undirected or directed
When I say “box and arrow” diagram, that’s actually wrong in an important way. Many graphs have edges that go both ways. If
you’re friends with somebody, it is a mutual arrangement. So in that case, you draw it as boxes and lines, not with arrows, and
we call this an undirected edge. But if two things do have some kind of ordering, you draw their relationship using a line with an
arrow head, which we call a directed edge.
Data & metadata on nodes and edges
It can be helpful to attach information to both nodes and edges. Like, an edge in a social network might be for a specific
relationship, like “Bob works with Alice”, or “Bob works for Alice”, or “Bob and Alice dated in college”. And so on.
Edge weights
Or, edges can have numeric weights, telling you the distance between cities, or whatever else you might want to model.
And when we run algorithms on graphs, it can be helpful to track metadata on how the algorithm is going, like when did the
algorithm first discover a node, or what path did we take from nodes A and B.
Graphs can have islands
They say that no man is an island, but we can model that anyway using a graph. Nodes in a graph don’t have to be connected
to anything! Or you can have a few nodes that are connected to each other, but not to other groups.
Nodes can point to themselves
It looks funny, but it is possible and sometimes necessary for a node to have an edge that connects back to itself. You’ll see this
more if you watch the Finite State Machine sequence.
Lots more “Graph properties”

If you want to dive more into the math around graphs, there are a zillion ways you can slice and dice them, usually with more
jargon to go with it. I’m just mentioning this here so you’re aware that I’m not trying to convey everything there is to know about
graphs. Suffice it to say, if there’s something you need to model with a graph, there is probably formal mathematical jargon to
go with it, and also probably an algorithm with someone’s name on it.
Directed acyclic graphs (DAG)
One kind of graph that I want to call out, because they appear so often, is the directed acyclic graph, which all the cool people
call by its initials, a DAG. This kind of graph has directed edges, like the name implies. It also means it can’t have cycles. A cycle
is where you can start at one node, and follow the directed edges through the graph and get back to where you started. There
are lots of algorithms that take advantage of DAGs.
If you’re trying to get an undergraduate degree, you’ve probably encountered these even if you didn’t realize it. When you start
the degree program, there are some classes you have to take in a certain order, and others you can take in any order. And all of
these boxes that represent classes all point to the terminal node, which is when you can graduate.
In lots of video games, you can unlock capabilities only by doing something else first. So another example is video game tech
trees.
In project management, they often model project work like this as well, and whatever the longest path is is called the critical
path because it determines when the project as a whole will be finished.
Next
So this episode just introduced the topic of graphs as a versatile data structure for modeling things and how they relate to one
another. In the next few episodes I’ll cover the two main algorithms for traversing graphs, called breadth-first search, and
depth-first search.

### E02: Depth-first search

#### Preamble
There are two main approaches to traversing a graph. One is depth-first search, which I’m covering in this episode, and the
other is breadth-first search. And also keep in mind, both DFS and BFS are just general strategies, sort of like how inorder
traversal for binary trees is just a general strategy. Lots of specific algorithms are variants of one of these two.
Why use DFS, or not
Depth-first search is one way to traverse a graph. In this approach, you go as deep into the graph as you can before
backtracking. This has some drawbacks and benefits.
One drawback is that if you’re trying to figure the distance between two nodes, depth-first won’t give you a reliable answer, but
breadth-first will.
One benefit to using DFS is that you can use it to determine if the graph has cycles in it. And knowing that a graph has cycles
or not is really useful information.
The intuition of DFS
So here’s a high level idea of depth-first search. Pick a node to start your search, and mark that you’ve been there. Pick an
adjacent node to go to, and mark that you’ve been there too. Always visit nodes that aren’t yet discovered.
When you’re done, pop the stack go back from where you were and pick an undiscovered node from there. As long as you mark
which nodes have been discovered, and as long as you keep track of how you got to where you are, you’ll eventually discover

everything that is discoverable.
It is sort of like how you’d solve a maze- keep looking down unexplored passageways, and backtrack when you’ve reached a
dead end.
Pseudocode
Here is pseudocode of the plain depth-first search:
```typescript
DFS(node):
```
discover node
visit node
for each edge e related to node:
other = other end of e
if other is undiscovered:
```typescript
DFS(other)
```
This is a recursive definition that receives a node to discover.
So this hinges on being able to keep track of your discovered nodes - that’s what the discover line means. And we also have
to be able to check if a node is discovered or not. That’s what the if other is undiscovered means. In some implementations
you can write that information directly onto a node - if your node structure supports it. Another way of doing it is to maintain a
set of discovered nodes, and pass that set into the dfs function along with the node to discover.
Example
One use for depth first search is solving problems that look like mazes. Here’s an undirected graph. Our hero, Theseus, is
starting in the middle node, and he’s trying to find the exit, which is on the left side. The edges that connect nodes represent
paths he can take. So you can eyeball the path that he’ll need to follow to get out.
(next build)
But! The algorithm can’t eyeball it, because it doesn’t have eyes.
So from the algorithm’s perspective, we’re starting from just the first node that we’ve discovered, and will only explore the
graph by looking at its structure and recording what we find along the way. Good luck, Theseus, I hope you find the exit!
(next build)
This is the pseudocode again, and we’ll use this to keep track of progress.
(next build)
First we discover and visit the node we’re on, which I’ll always show with Theseus’s avatar.
(next build - highlight edges)
The next step is to enter into a loop. We’re going to iterate through all the edges that originate from the current node. Since this
is an undirected graph, we don’t have to pay attention to direction at all. But if this was a directed graph, we’d only look at
outgoing edges.
Anyway, there are three edges to look through, and they’re highlighted here.

(next build - north edge)
We can only examine edges one at a time, and there is no particular order they will be picked. So the arbitrarily chosen one
happens to be to the North.
(next build - find node to north)
Now that we have an edge to examine, we get a reference to the node that is on the other side of that. When you code this, be
careful that you compare the two nodes the edge is related to, and identify the other one.
(next build - check if it is discovered)
Next, we have to check if the other end of this edge has been discovered or not. It hasn’t, so we’ll enter the if-statement’s body,
which
(next build - recurse into DFS)
Is to recursively call the DFS function, using the other node as its starting point.
This means that once we do that, we’ll have two calls to DFS in progress. The first one that we’ve been working on will wait
around for this second call to return. We’re using the recursive call here as a way of pushing state onto a stack, which will be
reinstalled later when the second DFS call pops from the call stack.
(next build - move Theseus up one)
OK, now we’re inside the next DFS call, so I’ve moved Theseus up by one node.
And the process starts all over again. We’ll discover and visit this node.
(next build - expose edge to the right)
And we’ll iterate through all the edges. From here, there are two edges - one to the right, and one below. The algorithm will
have us iterate through both, and they are not in any particular order.
(next build - choose edge below)
Maybe, just maybe, the edge we pick is the one that we just followed. This is a thing that can happen! So we follow the
algorithm, and get the other end of that edge.
(next build - other node has been discovered)
The algorithm is back on this part, where we check if the node has been discovered. And it has been. So, we’re not going to
enter the if-statement’s body. And there’s nothing left in the loop that we’re in, so we’re actually done with this edge, and
(next build - choose edge to right)
we move on to the next node, which is to Theseus’s right.
(next build - highlight node to right)
This one.

(next build - it has not been discovered)
And we can examine if this node has been discovered yet, and it has not. So
(next build - if body)
we can enter the if-statement’s body. Which of course is
(next build - recursive call)
just the recursive call, using this other node. So now we’re going to start
(next build - top of third DFS call)
in on the top of our third recursive call. By this point, I’ve actually talked out all the interesting things that could happen, so I’m
going to just flip through the rest of this and hope that Theseus gets out before he is eaten by a grue.
Eventually...
Eventually our search progresses through the maze until we either run out of places to look, or we find the exit. In this case, we
found the exit, and so the entire process can stop at this point.
Since we had a specific target, and we can stop early, it is OK if some of the nodes have not been uncovered yet. That is
normal.
I’ll go back to the intuition of DFS - since we’re using a stack of recursive calls to keep track of where we’ve been, and we
always recurse from the node we’re currently visiting, it really is sort of like you are a character searching through a maze - you
can’t zap around to other locations however you want to.
Next episode
In the next episode we’ll see the Breadth-first search algorithm, where you do zap around to discover nodes.

### E03: Breadth-first search

#### Preamble
Breadth-first search is the other main way for traversing a graph. And like the name implies, you go wide before going deep. It
is also the basis for lots of other more specialized graph algorithms, so learning this should be a good jumping off point for
fancier algorithms, should you need them.
The intuition of BFS
With breadth-first search, we’ll make a note of other nodes that we can examine by adding them to a queue.
And remember, queues have you process items in the order they were placed into the queue. This has an effect that, to me at
least, resembles a bit like what it would look like if you would pour liquid onto the floor, and watch it spread out from the center
of all that.
Why use BFS?
Breadth-first search will let you find the shortest path, or at least a shortest path, between two nodes. There might be a tie,
and BFS will find one of them. It is also really good for counting the number of hops between nodes, which is a common thing

to ask about, especially if you’re asking how many levels of separation are there between you and Kevin Bacon. And if there are
weights on the edges, BFS really shines.
Just like the pros and cons of depth-first search, it really depends on what you’re specifically trying to do. You can do these
things with a DFS-based algorithm as well, but BFS is often more suitable.
Pseudocode
```typescript
BFS(start_node):
queue = empty queue
```
add start_node to queue
discover start_node
while queue has stuff in it:
node = pop from queue
visit node
for all edges e related to node:
other_node = node on other end of e
if other_node is undiscovered:
add other_node to queue
discover other_node
if other_node is our search target, stop
This is pseudocode for a breadth-first search. You kick off the whole process by invoking BFS with some starting node.
It uses a queue to store nodes to process in the order they were discovered, so the first step is to create a queue and add our
starting node to it, mark it as discovered. Then we enter the main while loop where the algorithm spends almost all its time, as
long as there’s something in the queue.
At the top of the loop body, pop from the queue to get the next node in line. If you need to process the node in some way, this
is where you’d visit it.
Then, we need to look at all the edges that involve this node. Keep in mind that in a directed graph, edges that don’t start at our
node shouldn’t be considered here. Anyway, so we should get a set of related edges, and iterate through those.
For each edge, we’ll get the node on the other end of the edge, just like we did for depth-first search. And we have to check if
that other node has been discovered or not. If not, we’ll add it to the queue and mark it discovered.
If we’re searching for a particular node, this is where you’d check if you’ve found it, and if so, stop.
Otherwise, the process continues back at the top of the loop, now that we’ve added nodes to the queue.
Example
For breadth-first search, I’m going to use an example using a weird social network, with user avatars that I made with creepy AI.
Because why not?
This social network has undirected edges, and I’m going to run the breadth-first search algorithm on this first. But always keep
in mind that graphs can have directed edges, so I’ll also show what that looks like after I get through the undirected version.
So our graph involves Theseus, who apparently made it home from the labyrinth.
(next build - just Theseus)
So the initial call to our BFS code here receives the Theseus node, and none of the other nodes have yet been discovered, so
I’ve dimmed them out.

(next build - make an empty queue)
The next thing to do is to build an empty queue. This is where we will record all the nodes that are waiting to be processed.
Also notice I’ve added a spot at the bottom to show the current contents of the queue. It is empty now, but the very next thing
we do...
(next build - add Theseus to the queue)
... is add our starting node to the queue, and also mark it as discovered. And from now on, graphically you can tell what has
been discovered because those nodes aren’t dimmed out. If you implement this, you’ll need to keep track of that somehow, like
by adding the nodes to a set, or flipping a variable inside the node itself. How you do this is up to you. I personally like to use
sets.
So the next thing in the pseudocode is the big loop.
(next build - top of loop)
The loop’s boolean condition is that the queue has stuff in it. Very technical, accurate term there. We’re going to enter the loop
only if the queue is not empty. Is that better? This is why we added our starting node to the queue right away, so we would run
through the loop at least one time. So let’s do that.
(next build - pop Theseus)
First thing we do inside the loop is to pop from the queue. Recall, this means we remove and retrieve the item at the front of the
queue. So we have a reference to Theseus now, and he’s no longer in queue, which in fact is empty now. I’ve added a ‘current
node’ box above.
(next build - visit Theseus)
Next, the pseudocode says we visit the node. Go spend some time with Theseus, I’m sure he’s a blast. This means to process
the node in some way, and what that means depends on the specific goals you have in mind. Maybe you’re searching the graph
to filter out people from Colorado, or Greece? Maybe you’re counting how many hops from the starting node you’re at? We’re
not going to really do anything here.
(next build - edges from Theseus)
Now, we have a loop to iterate through the adjacent edges from the current node. Since this is an undirected graph, we don’t
need to check which way the arrow goes because there isn’t one. I’ll show the directed version in a bit.
Also, it is important that there is no particular ordering of edges. You could impose one if you need to, but in general, this is just
an unordered collection.
(next build - sad kid)
Since there’s no particular order, I just picked one of the edges at random. The other end of this edge is “sad kid”–that’s the
prompt I used to make the image.
(next build - sad kid was not discovered yet)
And we test if the other node has been discovered yet, and it wasn’t. So we enter the if-statement’s body.
(next build - if statement body)

Inside there, we do three things. First we add this node to the queue, so Sad Kid is now lined up to be processed. Next we mark
the node as discovered. And this last step is optional, if we’re searching for a particular node we can check for that here. We’re
not actually searching for a particular node, so I’ll just kind of ignore this from now on. But this is where you’d do that, and if it
was a match, we could return from the BFS entirely at that point.
Remember we’re in a loop, iterating over Theseus’s edges. So at this point we get back to the top of that loop.
(next build - top of edge loop)
So yeah, still looking at Theseus’s neighbors, and Theseus is still the current node. What we’re really doing here is just checking
in on the neighbors and enqueueing those who haven’t been discovered yet.
(next build - Patricia)
The next quasi-randomly chosen edge leads us to this node, who is Patricia.
(next build - enqueue Patricia)
And she’s undiscovered, so we enqueue and discover that node.
(next build - top of edge loop)
Back to the edge loop. Next edge brings us to...
(next build - red sweater guy)
Red sweater guy!
(next build - enqueue RSG)
Who was undiscovered, so enqueue and discover.
(next build - top of edge loop)
Back to the edge list, it is dwindling...
(next build - cartoon nose guy)
Next node is Cartoon Nose Guy.
(next build - enqueue CNG)
Also undiscovered, so enqueue and mark him as discovered.
(next build - top of edge loop)
Now we’re back to the edge loop control statement. But! We’re out of edges to explore! So we fall out of this loop, and it is the
last thing in the enclosing while loop.
(next build - back to while loop)

So control goes back to the while loop’s conditional expression. Also notice that since we’re not in the body of the while loop,
we’ve lost the concept of current node, so Theseus isn’t in that position anymore. In fact, the only data we have is our queue,
and our memory of what has been discovered.
While queue has stuff in it...
And our queue does indeed have stuff in it! So we re-enter the while loop’s body.
(next build - pop next node - Sad Kid)
So we pop the next node from the queue, which is Sad Kid. Notice he’s not in the queue anymore, it got shorter, and he’s now
the current node at the top.
(next build - visit sad kid)
Visit Sad Kid, cheer up, lad...
(next build - top of edge loop)
Now we’re back at the top of the edge loop. This is exactly the same as before, except we’ve discovered more nodes, and Sad
Kid is now the current node.
We have to consider all the edges adjacent to the current node, not just the ones that we can see with our eyes that lead to
discovered nodes. Let’s say the first edge leads us
(next build - other node is CNG)
to Cartoon Nose Guy.
(next build - CNG is already discovered)
Who has already been discovered, so we do nothing at all. And control returns to the edge loop.
(next build - top of edge loop)
But there are still edges to iterate through, like this one
(next build - other node is Evil Charlie Brown)
that leads us to Evil Charlie Brown.
(next build - ECB is undiscovered)
Who is undiscovered.
(next build - enqueue ECB)
so we enqueue and mark Evil Charlie Brown as discovered. With apologies to Charles Schultz.
(next build - top of edge loop)
At this point we’ve seen all the interesting things, so I’ll zip ahead with the algorithm for your viewing pleasure.

Finito
At the end, we are done when the queue doesn’t have stuff in it, technically speaking. The while loop’s condition is false, so we
fall out of that, and it was the last thing in the overall BFS routine.
Next
And at the end of all of this, what did we learn? Well, the basic BFS that we saw here doesn’t record any useful information,
aside from what has been discovered. So you could use this basic BFS to determine which nodes are reachable from a starting
point, sort of like a flood fill in a graphics editor.
A slightly fancier version might keep track of the number of hops from the starting node, and record which nodes were
recorded from where.
I promised I’d show what this looks like using a directed graph. So that’s coming up in the next one.

### E04: Breadth-first with directed graph

#### Preamble
I’ve shown how both depth-first and breadth-first graph traversals work, but I’ve only used undirected graphs for my
animations. It is important to also see how these processes work when the edges have arrows on them. So in this episode I’m
going to do a mini-version of the last episode, and work a breadth-first search using a graph that has directed edges.
This was the undirected graph
So just to hand things over nicely, this is the undirected form of the graph that we looked at in the last episode.
Behold... a directed graph version
This is the same graph, except I’ve added arrowheads to all the edges. Now, the connections between nodes are one-way
streets. They start at the node without the arrowhead, and end at the one with the arrowhead.
BFS: directed graph
I’ll start with Theseus again. The first part of the process is identical to last time.
(next build)
We initialize a queue, add the starting node to it, and also mark it as discovered.
(next build - top of while)
Then we enter the while loop, since the queue has the one item in it.
(next build - pop Theseus)
Like before we pop from the queue, which just has Theseus in it. So that’s our current node.
(next build - edges for Theseus)
So when we consider directed edges, we have to consider which way they’re going. With directed graphs, we’re only going to
consider the edges that originate at our node. So there are three edges that start at Theseus, but one edge that terminates at

Theseus. So that one, we won’t consider. You don’t even need to know it is there.
(next build - enqueue neighbors of Theseus)
So I’ll make this go a bit faster by combining all the related edges here. We have the three nodes that we can follow down the
directed edges that start at Theseus. And none of them are discovered yet, so we mark them discovered and add them to the
queue.
(next build - pop Sad Kid & enqueue neighbors)
Next we pop Sad Kid’s node, and enqueue all of his neighbors - and notice there’s one edge that comes from Cartoon Nose
Guy to Sad Kid, so that edge can’t be followed because it is the wrong direction. We do enqueue Evil Charlie brown and Other
Guy.
(next build - pop Patricia & can’t enqueue any neighbors)
The next node in the queue is Patricia, and none of the edges originate from her node, so there’s nothing more to do here.
(next build - Evil Charlie Brown)
Same thing with Evil Charlie Brown, there are no undiscovered nodes adjacent to him,
(next build - Boring Guy)
And same thing with Boring Guy.
Finito
And that takes us to the end. There are whole sections of the graph that were inaccessible because of the direction of the
edges. But this is as far as we can get, so now we’re all done.
That was graphs!
And this brings us to the end of the episode and end of this sequence on graphs.
It is easy to get caught up in the details of algorithms, but please don’t lose sight of the overall utility of graphs. They model
things and the relationships between those things - and I’m not even trying to be cheeky when I say that the world, outside of
computers, is chock full of things and relationships that can be modeled with graphs, inside of computers.
Keep an eye out for other sequences that involve Graphs, cuz they’re everywhere!

### S07: FSMs

Sequence Preamble
We're going to do a sequence involving a really useful, practical kind of graph called a state machine. This is an itty bitty
sequence of just two episodes. Short but so so sweet.

### E01 - Intro to state machines

#### Preamble
This episode just introduces what state machines are for, and some basic anatomy and how they work and what you can do
with them.
Automata: The Asterisk
State Machines are sometimes called 'automata', which is a blanket term for lots of super specific things.
Throughout this whole sequence, let me give a really big asterisk: This is an area of computer science theory, and this has all
been formalized by math in a way that I don’t want to get into. It is fun, but at this point would be really distracting.
So unless I specifically say so, I’m talking about state machines generally, or state charts which I'm talk more about in a minute.
I'm not generally going to talk about the strict formulation of "finite state machines". It is mostly a matter of momentum that
people say "finite state machine" when they probably mean something looser.
Types of state machines
Here's just a small part of what I meant just now by the mathematical formulations of automata.
You have finite state machines, which can remember which state it’s in (and there can be lots and lots of states). But the finite
state machines don’t have memory other than remember it’s current state.
Then you have pushdown automata, which are like finite state machines but the machine has some memory of what came
before, in the form of a stack-like structure.
There are lots of other structures that could be called state machines.
State charts
One of them is a state chart.
If you can extend the formal idea of a finite state machine into something that is practical for everyday software development,
you can give individual states some memory as well.
And maybe you can have nested states. For example, we might model a robot's state with two states, "standing" and "walking".
But within the "walking" state there might be "left foot moving" and "right foot moving", which are only relevant if the enclosing
"walking" state is current.
In the standing state, the substates are chewing gum and whistling. This robot can’t walk and chew gum at the same time.
Why we care
State machines can model so many things that I'm tempted to say they can model _anything_, though that's not actually true.
But to give you a sense of what they _can_ do:

- Recognize computer languages (like Python and Typescript)
- Physical computing and embedded systems
- Control the behavior of electro-mechanical systems like elevators
- Model GUI widgets like buttons and text boxes
- Classify text sequences (e.g. spell checking)
Automatic door state machine
Here’s an example of a finite state machine that you’ve probably already experienced.
When you walk up to a store, there's a motion sensor that opens the door. After the door has been open for a while, the door
closes.
But we know from real-world experience that doors don't instantly go from closed to open, or vice versa. And we also know
that if a bunch of people are passing through the door, that it stays open.
Better door state machine
So let's augment the state machine with two more states in the middle (opening and closing), and some transitions to keep the
door open as long as it detects motion, cuz maybe people are walking through the door.
And while it is in the process of closing, we also have to respond to motion to switch back to opening it. We don’t want to hurt
anyone, right?
This state machine is starting to look pretty real-world.
Anatomy of a state machine
A State Machine has a certain nomenclature. You've got States, Transitions, Signals, and Actions.
States
States are graph nodes that represent the machines' possible modes of existence. It can only be in one state at a time, which is
called the current one.
Default state
The default state is sometimes indicated with this "edge from nowhere", it's just the one above the A. The default state can be
used to reset the machine if needed.
Accepting states
There's also this idea of an Accepting State. This means the state machine is 'happy' in some computery way. We'll see
examples of this soon. I draw accepting states with the double stroke, like state B is. In this particular automata, it is in an
accepting state if the most recent signal was `signal_2`.
Current state
The current state determines how the state machine will respond to whatever signals it gets. It will only follow transitions that
exit the current state.

In this example, we're in state A, and we can transition out if we receive signal 1 or signal 2, but not if we receive signal 3, or a
yak, because there are no transitions with signal 3 or yaks exiting state A.
Transitions
Transitions are the edges. They're directed, so you have a start and end state, and they might be the same state!
Signals
Signals are the messages, events, or whatever other kind of input that the state machine receives. For example, say you have a
video game controller. Pressing the X button might trigger the "X pushed" signal, and releasing it sends the "X released" signal.
(next build - same signals)
When we draw the state machine, we label the transitions with the signal they try to match.
Actions
Actions are the outputs of the state machine, and they can be associated with entering or exiting states, or taking transitions.
When an action is taken, the state machine might emit some data output, or it might trigger some behavior, like turning a light
on or launching your spaceship.
If you read up on state machines on the internet, you'll often see this just called 'output'.
Self loops
And actions are the reason why we have these self-loops, like from B back into B. If there's an action associated with entering
state B (even if we're already in it) we can do interesting things.
Even-odd checker
Let's do a concrete example and watch how this simple state machine changes as it receives input. Say we're going to parse
that bit string at the bottom right, using the state machine you see here. The state we're in tells us if the input parsed so far is
an even or an odd number.
(next build)
Start in the Even state because of the arrow from nowhere, that's the default state.
(next build)
The first signal is a zero. From our current state, we have transitions for 0 and 1, and the one with a zero on it matches, so we're
going to take it.
This is a self-loop, and taking it puts the machine back into state Even. And remember there could be an action associated with
that, so we could maybe use that to count the number of zeros.
(next build)
Next signal has the same effect, back to state Even.

(next build)
Then we get a 1 and we're in the Odd state. Huzzah.
(next build)
I'll cruise through these now...
(next build)
get a 1
(next build)
another 1
(next build)
another 1
(next build)
a zero
(next build)
And that's the last bit, so we're done. We end up in the Odd state. This is a trivial example, but even complicated examples will
follow the same basic principles you just saw.
Next
In the next episode I’ll look at how you can build and use your own state machines.

### E02 - Using state machines

#### Preamble
Now we're going to get into the practicalities of building and using state machines.
Have an idea & draw it
When we use simple data structures like lists and trees, we're applying our own data to a prescribed structure. With finite state
machines, we have to define that structure before it can be used.
So what's involved with setting up a state machine?
Well, the first thing you need is something worth building. State machines really lend themselves to drawings, so... and you
probably know what I’m going to say, I suggest you make a quick and dirty sketch that captures your idea first.
State machine ingredients

To recap what we went over last time: state machines are built out of states and transitions, they accepts input in the form of
signals, and produce outputs in the form of actions.
And then you need something to control it all.
Configure
So configuring a finite state machine is basically declarative, you just establish all of those things and wire them together with
controlling logic that orchestrates everything.
Real world FSM: Flow selection
We've seen the sort of silly examples in the previous episode, the door and the simple even-or-odd machine. There's basically
an infinite supply.
This is the sketch you just saw, and it is something from my personal history, ancient history by now. This is a finite state
machine that models a little interaction technique for sketch-based interfaces.
(next build)
This is a cleaned up version of it. Same information, just made with vector graphics instead of a pen.
I'll come back to the diagram in just a second, but first let me show you what it does.
(video)
The idea here is that you can draw, and it will recognize what you're doing based on time and context.
If you press your finger or pen down and just hold it there for a while, it will start growing a selection on the nearby curve, until
you move your finger just enough, and then it starts deforming the curve. The idea is like you're heating the area up, with
variable selection strength, and then move your pen or finger to bend it into another shape.
The technique was originally called Flow selection, and during my startup days we renamed it to Recurve.
Recurve FSM
So this is the finite state machine that powers Recurve. There are timers involved here, so the 'drag' and 'hold' signals are sent
by other code that watch to see if the user's finger is dwelling in one place, or if it is moving around.
Notice that if the user starts drawing, all the initial drag events are interpreted as drawing ink. But then if the input slows down
enough for a hold signal to be generated, it will begin growing the selection. And as long as the input is still, the hold signals
keep coming and the selection keeps growing.
And then if the input starts moving again, it transitions into the reshape state, and that's where it will stay until the user lifts up.
From here, when they drag, it moves the selected region around. It seems like it is pretty complicated to code, but once I
realized that it was just this finite state machine, I coded it up in a few hours. This was before LLMs. I could probably do it in ten
minutes now!
So let’s define this machine with some declarative code. I see four circles for the states, so the first thing I do is make the
states.
(next build - show states)
Then there's all these transitions, all the arrows you see here. So then we can add a list of those. The transitions here are just
defined as having a start and end state that responds to some signal.

(next build - show transitions)
The last thing to do is attach some actions. We could put actions on the transitions. Alternately, or in addition to that, you can
attach the actions to each state, so that every time we transition into a state, something happens. So like for the drawing state,
every time we re-enter it, the action is "hey I am now at location X,Y", and it can do whatever drawing things it needs to do.
(next build - show actions)
So add some actions to the states. Those aren’t actually drawn in the picture, but I can see the states, and I know they all
correspond to some action when you enter or re-enter it on a self-loop.
I'm not showing any code for how the signals are generated since that's actually kinda complicated UI event handling stuff, but
it is besides the point anyway.
The code I _am_ showing is just pseudo-code, but it looks sort of like this in a real language. At any rate, the way you translate
the design into code follows this basic route.
So let this be some free advertising for how powerful finite state machines are, both as a design tool, and as a piece of
engineering. I love it when I design something and the answer ends up being a state machine, because they're powerful and
simple to build.
Now use the machine
Once you've set up the state machine, using it is straightforward. All you have to do is hook up the data source, or sources
plural, to the code that handles signals, and then let that do the rest of the work.
In this case, the data source involves watching the mouse, pen, or touch input system and running some timers to determine
when to emit 'hold' and 'drag' signals. Those signals feed the finite state machine, and the state machine generates actions
that do the right thing, either drawing, selecting, or deforming the selected curve.
Typical state machine usage
Using a state machine is easy, compared to the process of setting it up. The typical operations include:
- handle signal (messages, events, whatever you want to call them).
- get current state, to see which state it is in, maybe to see if it in an accepting state or not.
- reset to initial/default state, like if you need to go back to the beginning.
- handling actions, usually just callbacks to functions that you’ve defined.
Finite state machines are really powerful because they let you model complex behavior in an elegant data structure, so I hope
you can find a place for them in your quiver.
Epilogue
So that’s it for this sequence. It was short, for sure. There’s a lot of depth and nuance to automata, and if you ever work on
compilers or programming languages, or embedded systems you’ll definitely want to get more of that nuance.
But if you’re just getting started, building interactive things and you just want to model how things can change states based on
inputs, this should, maybe, I hope, have given you a good starting point.

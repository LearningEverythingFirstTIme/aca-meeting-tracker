export interface LiteratureItem {
  id: string;
  title: string;
  category: "foundational" | "steps" | "prayers" | "promises" | "service";
  content: string[];
  source?: string;
}

export const literatureData: LiteratureItem[] = [
  // FOUNDATIONAL
  {
    id: "preamble",
    title: "ACA Preamble",
    category: "foundational",
    source: "Adult Children of Alcoholics",
    content: [
      "Adult Children of Alcoholics (ACA) is a Twelve Step, Twelve Tradition program of people who grew up in dysfunctional homes. We meet to share our experience of growing up in an environment where abuse, neglect and trauma infected us. This affects us today and influences how we deal with all aspects of our lives.",
      "ACA provides a safe, nonjudgmental environment that allows us to grieve our childhoods and conduct an honest inventory of ourselves and our family—some for the first time. We practice acceptance. We take responsibility for our lives. We learn to value ourselves. We take action to improve our lives and the lives of those around us.",
      "We do this by attending meetings, working the Twelve Steps, studying the ACA literature, and learning to listen to our own inner voice. We work to free ourselves from the shame and the dysfunction that was our childhood. We learn to affirm ourselves and our worth. We gain a new freedom from the past and a renewed ability to be present in the moment."
    ]
  },
  {
    id: "problem",
    title: "The Problem",
    category: "foundational",
    source: "ACA Big Red Book",
    content: [
      "Many of us found that we had several characteristics in common as a result of being brought up in an alcoholic or dysfunctional household. We had come to feel isolated and uneasy with other people, especially authority figures. To protect ourselves, we became people-pleasers, even though we lost our own identities in the process. All the same we would mistake any personal criticism as a threat.",
      "We either became alcoholics (or practiced other addictive behavior) ourselves, or married them, or both. Failing that, we found other compulsive personalities, such as a workaholic, to fulfill our sick need for abandonment.",
      "We lived life from the standpoint of victims. Having an overdeveloped sense of responsibility, we preferred to be concerned with others rather than ourselves. We got guilt feelings when we stood up for ourselves rather than giving in to others. Thus we became reactors rather than actors, letting others take the initiative.",
      "We were dependent personalities who were terrified of abandonment and would do anything to hold on to a relationship in order not to experience painful abandonment feelings which we received from living with sick people who were never there emotionally for us.",
      "We confuse love with pity, tending to love those we could rescue. Even more self-defeating, we became addicted to excitement in all our affairs, preferring constant upset to workable solutions.",
      "This is a description, not an indictment."
    ]
  },
  {
    id: "solution",
    title: "The Solution",
    category: "foundational",
    source: "ACA Big Red Book",
    content: [
      "The solution is to become our own loving parent. This involves finding our inner child and giving that child the parenting it needs. We learn to love ourselves and value our own worth.",
      "We recover by working the Twelve Steps, attending meetings, and finding a Higher Power of our own understanding. We learn to affirm ourselves and our worth. We gain a new freedom from the past and a renewed ability to be present in the moment.",
      "We learn to play, to laugh, to feel, and to be vulnerable. We learn to set boundaries and to say no. We learn to ask for help and to receive love.",
      "We become our own loving parents and learn to give ourselves the nurturing we never received."
    ]
  },
  // THE 12 STEPS
  {
    id: "twelve-steps",
    title: "The Twelve Steps of ACA",
    category: "steps",
    source: "Adult Children of Alcoholics",
    content: [
      "1. We admitted we were powerless over the effects of alcoholism or other family dysfunction, that our lives had become unmanageable.",
      "2. Came to believe that a Power greater than ourselves could restore us to sanity.",
      "3. Made a decision to turn our will and our lives over to the care of God as we understood God.",
      "4. Made a searching and fearless moral inventory of ourselves.",
      "5. Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.",
      "6. Were entirely ready to have God remove all these defects of character.",
      "7. Humbly asked God to remove our shortcomings.",
      "8. Made a list of all persons we had harmed and became willing to make amends to them all.",
      "9. Made direct amends to such people wherever possible, except when to do so would injure them or others.",
      "10. Continued to take personal inventory and when we were wrong promptly admitted it.",
      "11. Sought through prayer and meditation to improve our conscious contact with God as we understood God, praying only for knowledge of God's will for us and the power to carry that out.",
      "12. Having had a spiritual awakening as the result of these steps, we tried to carry this message to others who still suffer, and to practice these principles in all our affairs."
    ]
  },
  // THE 12 TRADITIONS
  {
    id: "twelve-traditions",
    title: "The Twelve Traditions of ACA",
    category: "steps",
    source: "Adult Children of Alcoholics",
    content: [
      "1. Our common welfare should come first; personal recovery depends upon ACA unity.",
      "2. For our group purpose there is but one ultimate authority—a loving God as expressed in our group conscience. Our leaders are but trusted servants; they do not govern.",
      "3. The only requirement for ACA membership is a desire to recover from the effects of growing up in an alcoholic or otherwise dysfunctional family.",
      "4. Each group should be autonomous except in matters affecting other groups or ACA as a whole.",
      "5. Each group has but one primary purpose—to carry its message to the adult child who still suffers.",
      "6. An ACA group ought never endorse, finance, or lend the ACA name to any related facility or outside enterprise, lest problems of money, property, and prestige divert us from our primary purpose.",
      "7. Every ACA group ought to be fully self-supporting, declining outside contributions.",
      "8. Adult Children of Alcoholics should remain forever nonprofessional, but our service centers may employ special workers.",
      "9. ACA, as such, ought never be organized; but we may create service boards or committees directly responsible to those they serve.",
      "10. Adult Children of Alcoholics has no opinion on outside issues; hence the ACA name ought never be drawn into public controversy.",
      "11. Our public relations policy is based on attraction rather than promotion; we need always maintain personal anonymity at the level of press, radio, films, and the Internet.",
      "12. Anonymity is the spiritual foundation of all our Traditions, ever reminding us to place principles before personalities."
    ]
  },
  // THE 12 CONCEPTS
  {
    id: "twelve-concepts",
    title: "The Twelve Concepts of ACA Service",
    category: "service",
    source: "Adult Children of Alcoholics",
    content: [
      "1. Final responsibility and ultimate authority for ACA world services should always reside in the collective conscience of our whole Fellowship.",
      "2. The ACA groups delegate to the General Service Conference the authority necessary for them to provide for and conduct ACA world services.",
      "3. As a traditional means of creating and maintaining a clearly defined working relation between the groups and the Conference, the Charter is subscribed to by all of them and by all members of the Conference.",
      "4. Throughout the Conference structure, the traditional \"right of decision\" in all matters affecting the Conference, its services, and the Fellowship of ACA, should be assured to the Conference itself.",
      "5. Throughout the Conference structure, the traditional \"right of participation\" in all matters affecting the Conference, its services, and the Fellowship of ACA, should be assured to all members of the Conference.",
      "6. The Conference recognizes that the Charter and the spirit of the 12 Traditions should be the sole basis of Conference policy and action in all matters affecting the Conference, its services, and the Fellowship of ACA.",
      "7. The Charter of the Conference is to be regarded as the working document of reference and final authority in all matters affecting the Conference, its services, and the Fellowship of ACA.",
      "8. The Trustees of the General Service Board act in two primary capacities: (a) With respect to the larger matters of overall policy and finance, they are the principal planners and administrators. They and their primary committees directly manage these affairs. (b) With respect to our separately incorporated and constantly active services, the relation of the Trustees is that of custodial oversight which they exercise through their ability to elect all directors of these entities.",
      "9. Good service leadership at all levels is indispensable for our future functioning and safety. Primary world service leadership, once exercised by the founders, must necessarily be assumed by the trustees.",
      "10. Every service responsibility shall be matched by an equal service authority—the scope of such authority to be always well defined whether by tradition, by resolution, by specific job description or by appropriate charters and by-laws.",
      "11. While the trustees hold final responsibility for ACA world service administration, they should always have the assistance of the best possible standing committees, executives, staffs and consultants.",
      "12. The trustees should always have the best possible standing committees, executives, staffs and consultants to assist them in their work."
    ]
  },
  // PRAYERS - STEP PRAYERS
  {
    id: "step-prayers",
    title: "Step Prayers",
    category: "prayers",
    source: "ACA Program",
    content: [
      "STEP 1 PRAYER:",
      "I admit that I am powerless over the effects of alcoholism and family dysfunction. I admit that my life has become unmanageable as a result. Help me this day to understand the true meaning of powerlessness. Remove from me all denial of my childhood trauma.",
      "",
      "STEP 2 PRAYER:",
      "I pray for an open mind and a new way of life that can restore me to sanity. Grant me the gift of faith so that I may believe in things I cannot see.",
      "",
      "STEP 3 PRAYER:",
      "God, I offer myself to Thee—to build with me and to do with me as Thou wilt. Relieve me of the bondage of self, that I may better do Thy will. Take away my difficulties, that victory over them may bear witness to those I would help of Thy Power, Thy Love, and Thy Way of life. May I do Thy will always!",
      "",
      "STEP 4 PRAYER:",
      "God, please help me to honestly examine my strengths and weaknesses, my assets and my defects. Guide me as I search my heart and mind for a true and accurate picture of my childhood and its effects on my life today.",
      "",
      "STEP 5 PRAYER:",
      "God, give me the courage to share my inventory with another human being. Help me to be honest and thorough, hiding nothing. Remove my fear of judgment and shame.",
      "",
      "STEP 6 PRAYER:",
      "I am ready to have God remove all these defects of character. I ask for the willingness to let go of my old ways and accept the changes that recovery brings.",
      "",
      "STEP 7 PRAYER:",
      "My Creator, I am now willing that you should have all of me, good and bad. I pray that you now remove from me every single defect of character which stands in the way of my usefulness to you and my fellows. Grant me strength, as I go out from here, to do your bidding. Amen.",
      "",
      "STEP 8 PRAYER:",
      "God, help me to make a list of all those I have harmed. Give me the willingness to make amends to them all, and the wisdom to know when and how to do so.",
      "",
      "STEP 9 PRAYER:",
      "God, grant me the courage to make direct amends wherever possible. Give me the wisdom to know when making amends would cause more harm than good. Help me to restore justice where I can.",
      "",
      "STEP 10 PRAYER:",
      "God, help me to continue to take personal inventory. When I am wrong, prompt me to promptly admit it. Keep me mindful of my thoughts, words, and actions throughout the day.",
      "",
      "STEP 11 PRAYER (Morning):",
      "God, direct my thinking today so that it be divorced of self-pity, dishonesty, self-will, self-seeking and fear. Guide me in my meditation and help me to improve my conscious contact with You. Grant me the knowledge of Your will for me and the power to carry that out.",
      "",
      "STEP 11 PRAYER (Evening):",
      "God, as I review my day, show me where I have fallen short. Help me to make amends where needed and to learn from my mistakes. Thank You for the blessings of this day.",
      "",
      "STEP 12 PRAYER:",
      "Having had a spiritual awakening, I pray for the opportunity to carry this message to others who still suffer. Help me to practice these principles in all my affairs. Use me as an instrument of Your peace."
    ]
  },
  // ACA PRAYERS
  {
    id: "serenity-prayer",
    title: "The Serenity Prayer",
    category: "prayers",
    source: "Reinhold Niebuhr",
    content: [
      "God, grant me the serenity",
      "To accept the things I cannot change,",
      "The courage to change the things I can,",
      "And the wisdom to know the difference.",
      "",
      "Living one day at a time,",
      "Enjoying one moment at a time,",
      "Accepting hardship as the pathway to peace.",
      "Taking, as He did, this sinful world as it is,",
      "Not as I would have it.",
      "Trusting that He will make all things right",
      "If I surrender to His will.",
      "That I may be reasonably happy in this life,",
      "And supremely happy with Him forever in the next.",
      "Amen."
    ]
  },
  {
    id: "laundry-list-prayer",
    title: "The Laundry List Prayer",
    category: "prayers",
    source: "ACA",
    content: [
      "God,",
      "Help me to see myself clearly.",
      "Help me to grieve my childhood",
      "And to feel my feelings.",
      "Help me to let go of the past",
      "And to live in the present.",
      "Help me to become my own loving parent.",
      "Help me to love myself",
      "And to let others love me.",
      "Help me to play and to have fun.",
      "Help me to set healthy boundaries.",
      "Help me to say no without guilt.",
      "Help me to ask for help when I need it.",
      "Help me to be vulnerable and authentic.",
      "Help me to trust myself and others.",
      "Help me to find my true self",
      "And to live my own life.",
      "Amen."
    ]
  },
  {
    id: "inner-child-prayer",
    title: "Inner Child Prayer",
    category: "prayers",
    source: "ACA",
    content: [
      "Little one,",
      "I see you.",
      "I hear you.",
      "I believe you.",
      "It wasn't your fault.",
      "You didn't deserve what happened.",
      "You were just a child.",
      "You needed protection.",
      "You needed love.",
      "You needed to be heard.",
      "I am here now.",
      "I will listen.",
      "I will believe you.",
      "I will protect you.",
      "I will love you.",
      "You are safe with me.",
      "We will heal together.",
      "Amen."
    ]
  },
  {
    id: "set-aside-prayer",
    title: "Set Aside Prayer",
    category: "prayers",
    source: "ACA",
    content: [
      "God,",
      "Please help me set aside",
      "Everything I think I know",
      "About myself,",
      "About my family,",
      "About my past,",
      "About recovery,",
      "For an open mind",
      "And a new experience",
      "With the ACA program.",
      "Amen."
    ]
  },
  {
    id: "third-step-prayer",
    title: "Third Step Prayer",
    category: "prayers",
    source: "ACA Big Red Book",
    content: [
      "God, I offer myself to Thee—",
      "To build with me and to do with me as Thou wilt.",
      "Relieve me of the bondage of self,",
      "That I may better do Thy will.",
      "Take away my difficulties,",
      "That victory over them may bear witness",
      "To those I would help of Thy Power,",
      "Thy Love, and Thy Way of life.",
      "May I do Thy will always!"
    ]
  },
  {
    id: "seventh-step-prayer",
    title: "Seventh Step Prayer",
    category: "prayers",
    source: "ACA Big Red Book",
    content: [
      "My Creator,",
      "I am now willing that you should have all of me,",
      "Good and bad.",
      "I pray that you now remove from me",
      "Every single defect of character",
      "Which stands in the way of my usefulness to you and my fellows.",
      "Grant me strength, as I go out from here,",
      "To do your bidding.",
      "Amen."
    ]
  },
  // THE PROMISES
  {
    id: "aca-promises",
    title: "The Promises of ACA",
    category: "promises",
    source: "ACA Big Red Book",
    content: [
      "We will discover our real identities by loving and accepting ourselves.",
      "",
      "Our self-esteem will increase as we give ourselves the respect and dignity we deserve.",
      "",
      "Our fears of failure and rejection will begin to dissolve as we risk being vulnerable and authentic with others.",
      "",
      "We will begin to share our feelings and experiences with safe people in safe places.",
      "",
      "We will gradually release the repressed emotions of our childhood and allow ourselves to grieve.",
      "",
      "As we grieve, we will begin to feel lighter and more hopeful about our lives.",
      "",
      "We will begin to take responsibility for our own lives and to make choices that support our well-being.",
      "",
      "We will learn to set healthy boundaries and to say no without guilt.",
      "",
      "We will develop a personal relationship with a Higher Power of our own understanding.",
      "",
      "We will begin to experience serenity, joy, and peace of mind."
    ]
  },
  {
    id: "laundry-list",
    title: "The Laundry List",
    category: "foundational",
    source: "ACA",
    content: [
      "The Laundry List is a list of 14 traits of adult children. It describes how we have been affected by growing up in a dysfunctional home.",
      "",
      "1. We became isolated and afraid of people and authority figures.",
      "",
      "2. We became approval seekers and lost our identity in the process.",
      "",
      "3. We are frightened by angry people and any personal criticism.",
      "",
      "4. We either become alcoholics, marry them, or both, or find another compulsive personality such as a workaholic to fulfill our sick abandonment needs.",
      "",
      "5. We live life from the standpoint of victims and are attracted by that weakness in our love and friendship relationships.",
      "",
      "6. We have an overdeveloped sense of responsibility and it is easier for us to be concerned with others rather than ourselves; this enables us not to look too closely at our own faults.",
      "",
      "7. We get guilt feelings when we stand up for ourselves instead of giving in to others.",
      "",
      "8. We became addicted to excitement.",
      "",
      "9. We confuse love and pity and tend to \"love\" people we can \"pity\" and \"rescue.\"",
      "",
      "10. We have \"stuffed\" our feelings from our traumatic childhoods and have lost the ability to feel or express our feelings because it hurts so much.",
      "",
      "11. We judge ourselves harshly and have a very low sense of self-esteem.",
      "",
      "12. We are dependent personalities who are terrified of abandonment and will do anything to hold on to a relationship in order not to experience painful abandonment feelings which we received from living with sick people who were never there emotionally for us.",
      "",
      "13. Alcoholism is a family disease; and we became para-alcoholics and took on the characteristics of that disease even though we did not pick up the drink.",
      "",
      "14. Para-alcoholics are reactors rather than actors."
    ]
  },
  {
    id: " ACA-Slogans",
    title: "ACA Slogans",
    category: "foundational",
    source: "Adult Children of Alcoholics",
    content: [
      "PROGRESS, NOT PERFECTION",
      "",
      "TAKE WHAT YOU LIKE AND LEAVE THE REST",
      "",
      "FIRST THINGS FIRST",
      "",
      "EASY DOES IT",
      "",
      "KEEP COMING BACK",
      "",
      "ONE DAY AT A TIME",
      "",
      "KEEP IT SIMPLE",
      "",
      "LET GO AND LET GOD",
      "",
      "THIS TOO SHALL PASS",
      "",
      "LIVE AND LET LIVE",
      "",
      "THINK... THINK... THINK...",
      "",
      "HALT - Don't get too Hungry, Angry, Lonely, or Tired",
      "",
      "THE CURE FOR THE PAIN IS IN THE PAIN",
      "",
      "FEELINGS AREN'T FACTS"
    ]
  }
];

export const categories = [
  { id: "foundational", label: "Foundational", color: "var(--butter)" },
  { id: "steps", label: "Steps & Traditions", color: "var(--mint)" },
  { id: "prayers", label: "Prayers", color: "var(--lavender)" },
  { id: "promises", label: "Promises", color: "var(--coral)" },
  { id: "service", label: "Service", color: "var(--cream)" }
] as const;

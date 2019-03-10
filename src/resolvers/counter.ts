export default {
    Counter: {
      countStr: counter => {
          
        console.log("10 counter",counter);
       return `Current count: ${counter.count}`;
      },
    },
    Subscription: {
      counter: {
        subscribe: (parent, args, { pubsub }) => {
          const channel = Math.random().toString(36).substring(2, 15) // random channel name
          let count = 0
          console.log("10 count",count);
          setInterval(() => pubsub.publish("channel", { counter: { count: count++ } }), 2000)
          return pubsub.asyncIterator("channel")
        },
      }
    },
  }


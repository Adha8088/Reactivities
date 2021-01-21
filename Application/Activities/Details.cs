using System.Threading.Tasks;
using System.Threading;
using MediatR;

using Domain;
using Persistence;
using System;
using Application.Errors;
using System.Net;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext context;

            public Handler(DataContext context)
            {
                this.context = context;
            }

            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                var a = await context.Activities.FindAsync(request.Id);

                if (a == null)
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not found" });

                return a;
            }
        }
    }
}
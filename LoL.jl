using JuMP
using DataFrames
using Gurobi

function optimize(U_B, U_R)


    U_B = DataFrame(U_B, :auto)
    U_R = DataFrame(U_R, :auto)

    blue_bans = [1, 3, 5, 14, 16]
    red_bans = [2, 4, 6, 13, 15]
    blue_picks = [7, 10, 11, 18, 19]
    red_picks = [8, 9, 12, 17, 20]

    I, J, T = size(U_R)[1], size(U_R)[2], 20

    model = Model(Gurobi.Optimizer)
    @variable(model, x[i=1:I, j=1:J, t=1:T] >= 0, Bin)
    @variable(model, y[i=1:I, j=1:J, t=1:T] >= 0, Bin)
    @variable(model, u[i=1:I, j=1:J, t=1:T] >= 0, Bin)
    @variable(model, v[i=1:I, j=1:J, t=1:T] >= 0, Bin)

    @objective(model, Max, sum(U_B[i, j] * x[i, j, t] + U_R[i, j] * u[i, j, t] + y[i, j, t] * U_R[i, j] + v[i, j, t] * U_B[i, j] for i = 1:I, j = 1:J, t = 1:T))

    @constraint(model, [i = 1:I], sum(x[i, j, t] + u[i, j, t] + v[i, j, t] + y[i, j, t] for j = 1:J, t = 1:T) <= 1)

    @constraint(model, [j = 1:J], sum(x[i, j, t] for i = 1:I, t = 1:T) <= 1)
    @constraint(model, [j = 1:J], sum(y[i, j, t] for i = 1:I, t = 1:T) <= 1)

    @constraint(model, [j = 1:J], sum(x[i, j, t] for i = 1:I, t = 1:T) <= 1)
    @constraint(model, [j = 1:J], sum(y[i, j, t] for i = 1:I, t = 1:T) <= 1)

    @constraint(model, sum(x[i, j, t] for i = 1:I, j = 1:J, t = 1:T) <= 5)
    @constraint(model, sum(y[i, j, t] for i = 1:I, j = 1:J, t = 1:T) <= 5)
    @constraint(model, sum(u[i, j, t] for i = 1:I, j = 1:J, t = 1:T) <= 5)
    @constraint(model, sum(v[i, j, t] for i = 1:I, j = 1:J, t = 1:T) <= 5)

    for t in blue_bans
        @constraint(model, sum(u[i, j, t] for i = 1:I, j = 1:J) == 1)
    end

    for t in blue_picks
        @constraint(model, sum(x[i, j, t] for i = 1:I, j = 1:J) == 1)
    end

    for t in red_picks
        @constraint(model, sum(y[i, j, t] for i = 1:I, j = 1:J) == 1)
    end

    for t in red_bans
        @constraint(model, sum(v[i, j, t] for i = 1:I, j = 1:J) == 1)
    end

    optimize!(model)

    output_x = value.(x)
    output_y = value.(y)
    output_u = value.(u)
    output_v = value.(v)

    obj_B = sum(U_B[i, j] * output_x[i, j, t] + U_R[i, j] * output_u[i, j, t] for i = 1:I, j = 1:J, t = 1:T)
    obj_R = sum(U_R[i, j] * output_y[i, j, t] + U_B[i, j] * output_v[i, j, t] for i = 1:I, j = 1:J, t = 1:T)
    overall = obj_B + obj_R

    return output_x, output_y, output_u, output_v, obj_B, obj_R, overall

end